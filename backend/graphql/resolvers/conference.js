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
		async addAttendee(parent, { conferenceId, userId }) {
			const attendee = await User.findOne({ _id: userId });
			if (!attendee) {
				throw new UserInputError("User not found.");
			}
			const conference = await Conference.findOne({
				_id: conferenceId,
			}).populate("host");
			if (!conference) {
				throw new UserInputError("Conference not found.");
			}
			const userExists = conference.attendees.find((a) => a.userId == userId);
			if (userExists) {
				throw new UserInputError(
					"You are already signed up for the conference."
				);
			}

			const date = new Date();
			const dueDate = date.setDate(date.getDate() + 30);

			const invoice = new Invoice({
				issuer: conference.host,
				payer: attendee.billing,
				payment: {
					variableSymbol:
						conference.variableSymbol +
						Math.floor(Math.random() * 9000 + 1000).toString(),
					ticketPrice: conference.ticketPrice,
					tax: attendee.isFlaw ? 0 : conference.ticketPrice * 0.2,
				},
				invoice: {
					type: "Faktúra",
					issueDate: Date.now(),
					vatDate: Date.now(),
					dueDate,
					body: `This invoice is issued to ${
						attendee.fullName
					} and covers fee for conference "${conference.name}" hosted by ${
						conference.host.billing.name
					} that will take place in ${
						conference.venue.name
					}. The conference is beginning on ${conference.start.toLocaleDateString(
						"en-GB",
						{ timeZone: "UTC" }
					)} and ending on ${conference.end.toLocaleDateString("en-GB", {
						timeZone: "UTC",
					})}.`,
					comment: `The hosting organisation is reserving the right to cancel attendee registration in case of not paying the fee in due time.`,
				},
				conferenceId: conference._id,
				userId: attendee._id,
			});
			const options = {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			};
			//console.log(invoice);
			console.log(
				conference.start.toLocaleString("sk-SK", { timeZone: "UTC" })
			);
			console.log(conference.start.toString());
			console.log(new Date(Date.now()).toLocaleString("sk-SK"));

			return conference;
		},
	},
};
