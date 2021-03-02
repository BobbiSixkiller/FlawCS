const { UserInputError } = require("apollo-server-express");

const Conference = require("../../models/Conference");
const {
	validateConference,
	validateSection,
} = require("../../util/validation");

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
				host: conferenceInput.host,
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
		async createSection(parent, { conferenceId, name, topic }) {
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

			const section = { name, topic };
			conference.sections.push(section);
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
			section.name = name;
			section.topic = topic;
			const res = await conference.save();

			return res;
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
	},
};
