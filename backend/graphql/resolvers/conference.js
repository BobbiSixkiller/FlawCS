const { UserInputError } = require("apollo-server-express");

const Conference = require("../../models/Conference");
const { validateConference } = require("../../util/validation");

module.exports = {
	Query: {
		async getConferences() {
			try {
				const conferences = await Conference.find()
					.populate("host")
					.sort({ updatedAt: -1 });
				return conferences;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getConference(parent, { conferenceId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
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
		async updateConference() {},
		async deleteConference(parent, { conferenceId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				await conference.remove();
				return "Conference has been deleted.";
			} else {
				throw new Error("Conference not found.");
			}
		},
	},
};
