const { UserInputError } = require("apollo-server-express");

const Conference = require("../../models/Conference");
const { validateConference } = require("../../util/validation");

module.exports = {
	Query: {
		async getUpcomingConferences() {
			const conferences = await Conference.find({
				regEnd: { $gt: Date.now() },
			});
			if (conferences.length === 0) {
				throw new Error("No upcoming conferences.");
			}
			return conferences;
		},
		async getConferences(parent, { hostId }) {
			const filter = hostId.length !== 0 ? { host: hostId } : {};

			const conferences = await Conference.find(filter).sort({
				updatedAt: -1,
			});
			return conferences;
		},
		async getConference(parent, { conferenceId }) {
			const conference = await Conference.findOne({
				_id: conferenceId,
			}).populate("host");

			if (conference) {
				return conference;
			} else {
				throw new UserInputError("Conference not found.");
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
				throw new UserInputError("Conference not found!");
			}
		},
		async deleteConference(parent, { conferenceId }) {
			const conference = await Conference.findOne({ _id: conferenceId });
			if (conference) {
				await conference.remove();
				return "Conference has been deleted.";
			} else {
				throw new UserInputError("Conference not found.");
			}
		},
	},
};
