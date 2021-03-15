const { UserInputError } = require("apollo-server-express");

const Section = require("../../models/Section");
const Conference = require("../../models/Conference");
const { validateSection } = require("../../util/validation");

module.exports = {
	Query: {
		async getSections() {
			try {
				const sections = await Section.find().sort({ createdAt: -1 });
				return sections;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getSection(parent, { sectionId }) {
			const section = await Section.findOne({ _id: sectionId });
			if (section) {
				return section;
			} else {
				throw new UserInputError("Section not found.");
			}
		},
	},
	Mutation: {
		async createSection(parent, { conferenceId, name, topic }) {
			const { errors, valid } = validateSection(name, topic);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (!conference) {
				throw new UserInputError("Conference not found.");
			}
			const section = new Section({ name, topic });
			await section.save();

			conference.sections.push({ name, section: section._id });
			await conference.save();

			return conference;
		},
		async updateSection(
			parent,
			{ conferenceId, sectionId, name, topic, start, end }
		) {
			const { errors, valid } = validateSection(name, topic);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.find((s) => s.section == sectionId);
				section.name = name;
			} else {
				throw new UserInputError("Conference not found.");
			}

			const res = Section.findOneAndUpdate(
				{ _id: sectionId },
				{ name, topic, start, end },
				{ new: true }
			);
			if (res) {
				return res;
			} else {
				throw new UserInputError("Section not found.");
			}
		},
		async deleteSection(parent, { sectionId }) {
			const section = await Section.findOne({ _id: sectionId });
			if (section) {
				await section.remove();
				return "Section has been deleted.";
			} else {
				throw new UserInputError("Section not found.");
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
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
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
						throw new UserInputError("Garant not found.");
					}
				} else {
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
		async addCoordinator(
			parent,
			{ conferenceId, sectionId, name, coordinator }
		) {
			const { errors, valid } = validateGarant(name, coordinator);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const coordinatorExists = section.coordinators.find(
						(c) => c.coordinator == coordinator
					);
					if (coordinatorExists) {
						throw new UserInputError("Errors", {
							errors: { name: "Coordinator has been submitted already." },
						});
					}
					section.coordinators.push({ name, coordinator });
				} else {
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
		async deleteCoordinator(
			parent,
			{ conferenceId, sectionId, coordinatorId }
		) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const coordinator = section.coordinators.id(coordinatorId);
					if (coordinator) {
						coordinator.remove();
					} else {
						throw new UserInputError("Coordinator not found.");
					}
				} else {
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
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
						throw new UserInputError(
							"You have already provided your submission to this conference."
						);
					}
					const submission = new Submission({
						...submissionInput,
						user: id,
						conference: conferenceId,
					});
					await submission.save();

					const speaker = {
						name,
						speaker: id,
						submission: submission._id,
					};
					section.speakers.push(speaker);
				} else {
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
		async addSpeaker(
			parent,
			{ conferenceId, sectionId, userId, name, submissionInput }
		) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				const section = conference.sections.id(sectionId);
				if (section) {
					const speakerExists = section.speakers.find(
						(s) => s.speaker == userId
					);
					if (speakerExists) {
						throw new UserInputError(
							"Selected user have already provided submission to this conference."
						);
					}
					const submission = new Submission({
						...submissionInput,
						user: userId,
						conference: conferenceId,
					});
					await submission.save();

					const speaker = {
						name,
						speaker: userId,
						submission: submission._id,
					};
					section.speakers.push(speaker);
				} else {
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
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
						const submission = await Submission.findOne({
							_id: speaker.submission,
						});
						if (submission) {
							await submission.remove();
						} else {
							throw new UserInputError("Submission not found.");
						}
						speaker.remove();
					} else {
						throw new UserInputError("Speaker not found.");
					}
				} else {
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
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
						throw new UserInputError("Speaker not found");
					}
				} else {
					throw new UserInputError("Section not found.");
				}
			} else {
				throw new UserInputError("Conference not found.");
			}

			const res = await conference.save();

			return res;
		},
	},
};
