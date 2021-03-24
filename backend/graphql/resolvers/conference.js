const { UserInputError } = require("apollo-server-express");

const Conference = require("../../models/Conference");
const User = require("../../models/User");
const Invoice = require("../../models/Invoice");
const { validateConference } = require("../../util/validation");

module.exports = {
	Query: {
		async getUpcomingConferences(parent, { hostId }) {
			const filter = hostId
				? { host: hostId, regEnd: { $gt: Date.now() } }
				: { regEnd: { $gt: Date.now() } };

			const conferences = await Conference.find(filter).populate("host");
			if (conferences.length === 0) {
				throw new Error("No upcoming conferences.");
			}
			return conferences;
		},
		async getConferences(parent, { hostId }) {
			const filter = hostId ? { host: hostId } : {};

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
				variableSymbol: conferenceInput.variableSymbol,
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
				variableSymbol: conferenceInput.variableSymbol,
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
		async addAttendee(parent, { conferenceId, userId }, { user }) {
			const conference = await Conference.findOne({
				_id: conferenceId,
			}).populate("host");
			if (!conference) {
				throw new UserInputError("Conference not found.");
			}
			const userExists = conference.attendees.find(
				(a) => a.userId == userId || a.userId == user.id
			);
			if (userExists) {
				throw new UserInputError(
					"You are already signed up for the conference."
				);
			}

			const userFilter = userId ? { _id: userId } : { _id: user.id };
			const attendee = await User.findOne(userFilter);

			const invoice = new Invoice({
				issuer: {
					name: conference.host.name,
					address: conference.host.address,
					ICO: conference.host.ICO,
					ICDPH: conference.host.ICDPH,
					IBAN: conference.host.IBAN,
					SWIFT: conference.host.SWIFT,
					logoUrl: conference.host.logoUrl,
					signatureUrl: conference.host.signatureUrl,
				},
				payer: attendee.billing,
				payment: {
					form: "Faktura - danovy doklad",
					variableSymbol: conference.variableSymbol,
				},
				invoice: {},
				conferenceId: conference._id,
				userId: attendee._id,
			});

			console.log(invoice);

			return conference;
		},
	},
};
