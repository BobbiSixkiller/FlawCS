const { UserInputError, chainResolvers } = require("apollo-server-express");

const Conference = require("../../models/Conference");
const Submission = require("../../models/Submission");
const {
	validateConference,
	validateSection,
	validateGarant,
	validateSubmission,
} = require("../../util/validation");
const conference = require("../typeDefinitions/conference");

module.exports = {
	Query: {
		async getConferences() {
			try {
				const conferences = await Conference.find().sort({ updatedAt: -1 });
				return conferences;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getConference(parent, { conferenceId }) {
			const conference = await Conference.findOne({
				_id: conferenceId,
			}).populate("host");
			if (conference) {
				return conference;
			} else {
				throw new Error("Conference not found.");
			}
		},
	},
	Mutation: {
		async createConference(parent, { conferenceInput, venueInput }) {
			const { errors, valid } = validateConference({
				conference: { ...conferenceInput },
				venue: { ...venueInput },
			});
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = new Conference({
				name: conferenceInput.name,
				start: conferenceInput.start,
				end: conferenceInput.end,
				regStart: conferenceInput.regStart,
				regEnd: conferenceInput.regEnd,
				ticketPrice: conferenceInput.ticketPrice,
				"venue.name": venueInput.name,
				"venue.address.street": venueInput.address.street,
				"venue.address.city": venueInput.address.city,
				"venue.address.postal": venueInput.address.postal,
				"venue.address.country": venueInput.address.country,
				host: conferenceInput.hostId,
			});

			const res = await conference.save();

			return res;
		},
		async updateConference(
			parent,
			{ conferenceId, conferenceInput, venueInput }
		) {
			const { errors, valid } = validateConference({
				conference: { ...conferenceInput },
				venue: { ...venueInput },
			});
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const update = {
				name: conferenceInput.name,
				start: conferenceInput.start,
				end: conferenceInput.end,
				regStart: conferenceInput.regStart,
				regEnd: conferenceInput.regEnd,
				ticketPrice: conferenceInput.ticketPrice,
				"venue.name": venueInput.name,
				"venue.address.street": venueInput.address.street,
				"venue.address.city": venueInput.address.city,
				"venue.address.postal": venueInput.address.postal,
				"venue.address.country": venueInput.address.country,
				host: conferenceInput.hostId,
			};

			const res = await Conference.findOneAndUpdate(
				{ _id: conferenceId },
				update,
				{ new: true }
			).populate("host");

			if (res) {
				return res;
			} else {
				throw new Error("Conference not found!");
			}
		},
		async deleteConference(parent, { conferenceId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				await conference.remove();
				return "Conference has been deleted.";
			} else {
				throw new Error("Conference not found.");
			}
		},
		async addSection(parent, { conferenceId, name, topic }) {
			const { errors, valid } = validateSection(name, topic);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const sectionExists = conference.sections.find(
					(section) => section.name === name
				);
				if (sectionExists) {
					throw new UserInputError("Errors", {
						errors: {
							name: "Conference already has a section with this name.",
						},
					});
				}
			} else {
				throw new Error("Conference not found.");
			}

			conference.sections.push({ name, topic });
			const res = await conference.save();

			return res;
		},
		async updateSection(parent, { conferenceId, sectionId, name, topic }) {
			const { errors, valid } = validateSection(name, topic);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const sectionExists = conference.sections.find(
					(section) => section.name === name
				);
				if (sectionExists) {
					throw new UserInputError("Errors", {
						errors: {
							name: "Conference already has a section with this name.",
						},
					});
				}
			} else {
				throw new Error("Conference not found.");
			}

			const section = conference.sections.id(sectionId);
			if (section) {
				section.name = name;
				section.topic = topic;
				const res = await conference.save();
				return res;
			} else {
				throw new Error("Section not found.");
			}
		},
		async deleteSection(parent, { conferenceId, sectionId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				conference.sections.id(sectionId).remove();
				const res = await conference.save();
				return res;
			} else {
				throw new Error("Conference not found.");
			}
		},
		async addGarant(parent, { conferenceId, sectionId, name, garant }) {
			const { errors, valid } = validateGarant(name, garant);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const garantExists = section.garants.find((g) => g.garant == garant);
					if (garantExists) {
						throw new UserInputError("Errors", {
							errors: { name: "Garant has been submitted already." },
						});
					}
					section.garants.push({ name, garant });
				} else {
					throw new Error("Section not found.");
				}
			} else {
				throw new Error("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
		async deleteGarant(parent, { conferenceId, sectionId, garantId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const garant = section.garants.id(garantId);
					if (garant) {
						garant.remove();
					} else {
						throw new Error("Garant not found.");
					}
				} else {
					throw new Error("Section not found.");
				}
			} else {
				throw new Error("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
		async addSubmission(
			parent,
			{ conferenceId, sectionId, submissionInput },
			{ user: { id, name } }
		) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const speakerExists = section.speakers.find((s) => s.speaker == id);
					if (speakerExists) {
						throw new Error(
							"You have already provided your submission to this conference."
						);
					}
					const submission = new Submission({
						...submissionInput,
						user: id,
					});
					await submission.save();
					console.log(submission._id);

					const speaker = {
						name,
						speaker: id,
						submission: submission._id,
					};
					section.speakers.push(speaker);
				} else {
					throw new Error("Section not found.");
				}
			} else {
				throw new Error("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
		async deleteSpeaker(parent, { conferenceId, sectionId, speakerId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const speaker = section.speakers.id(speakerId);
					if (speaker) {
						speaker.remove();
					} else {
						throw new Error("Speaker not found");
					}
				} else {
					throw new Error("Section not found.");
				}
			} else {
				throw new Error("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
		async approveSpeaker(parent, { conferenceId, sectionId, speakerId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const speaker = section.speakers.id(speakerId);
					if (speaker) {
						speaker.accepted = !speaker.accepted;
					} else {
						throw new Error("Speaker not found");
					}
				} else {
					throw new Error("Section not found.");
				}
			} else {
				throw new Error("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
	},
};
