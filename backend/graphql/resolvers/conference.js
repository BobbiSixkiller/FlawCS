const { UserInputError } = require("apollo-server-express");
require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const Host = require("../../models/Host");
const Conference = require("../../models/Conference");
const User = require("../../models/User");
const Invoice = require("../../models/Invoice");
const send = require("../../util/mail");
const generatePDF = require("../../util/pdf");
const invoiceTemplate = require("../../util/invoice");
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
				...conferenceInput,
				venue: { ...venueInput },
			});

			const res = await conference.save();

			return res;
		},
		async updateConference(
			parent,
			{ conferenceId, conferenceInput, venueInput }
		) {
			// const { errors, valid } = validateConference({
			// 	conference: { ...conferenceInput },
			// 	venue: { ...venueInput },
			// });
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }

			const update = { ...conferenceInput, venue: { ...venueInput } };

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
			const [user, conference] = await Promise.all([
				User.findOne({ _id: userId }),
				Conference.findOne({
					_id: conferenceId,
				}).populate("host"),
			]);
			if (!user) {
				throw new UserInputError("User not found.");
			}
			if (!conference) {
				throw new UserInputError("Conference not found.");
			}
			if (!conference.host) {
				throw new UserInputError("Host not found.");
			}

			const userExists = conference.attendees.find((a) => a.userId == userId);
			if (userExists) {
				throw new UserInputError(
					"You are already signed up for the conference."
				);
			}

			const date = new Date();
			const invoice = new Invoice({
				issuer: conference.host,
				payer: user.billing,
				invoice: {
					type: "Faktúra",
					issueDate: Date.now(),
					vatDate: Date.now(),
					dueDate: date.setDate(date.getDate() + 30),
					variableSymbol:
						conference.variableSymbol +
						Math.floor(Math.random() * 9000 + 1000).toString(),
					ticketPrice: conference.ticketPrice,
					vat: user.isFlaw ? 0 : conference.ticketPrice * process.env.VAT,
					body: `This invoice is issued to ${
						user.fullName
					} and covers fee for conference "${conference.name}" hosted by ${
						conference.host.billing.name
					} that will take place in ${
						conference.venue.name
					}. The conference is beginning on ${conference.start.toLocaleDateString()} and ending on ${conference.end.toLocaleDateString()}.`,
					comment: `The hosting organisation is reserving the right to cancel attendee registration in case of not paying the fee in due time.`,
				},
				conferenceId: conference._id,
				userId: user._id,
			});

			const attendee = {
				name: user.fullName,
				userId: user._id,
				invoiceId: invoice._id,
			};
			conference.attendees.push(attendee);

			const invoiceHTML = invoiceTemplate(invoice);
			const attachments = [
				{
					filename: "Invoice.pdf",
					content: await generatePDF(invoiceHTML),
				},
			];
			const mail = send(
				user.email,
				`${conference.name} Invoice`,
				`Dear ${user.fullName},\n\nYou have been successfully registered to conference: ${conference.name}.\nThe hosting organisation is reserving the right to cancel attendee registration in case of not paying the fee in due time.\nInvoice in PDF format can be found in attachments.\n\nThis email has been generated by FlawCS system, please do not reply.`,
				invoiceHTML,
				attachments
			);

			await Promise.all([invoice.save(), conference.save()]);

			return conference;
		},
		async removeAttendee(_, { conferenceId, userId }) {
			const conference = await Conference.findOneAndUpdate(
				{
					_id: conferenceId,
					"attendees.userId": userId,
				},
				{ $pull: { attendees: { userId } } },
				{ new: true }
			);
			if (!conference) {
				throw new UserInputError("Conference or user not found.");
			}

			const invoice = await Invoice.findOne({ userId, conferenceId });
			if (!invoice) {
				throw new UserInputError("Invoice not found.");
			}
			await invoice.remove();

			return "Attendee removed.";
		},
	},
};
