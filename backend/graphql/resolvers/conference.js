const { UserInputError } = require("apollo-server-express");
require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const Conference = require("../../models/Conference");
const User = require("../../models/User");
const Invoice = require("../../models/Invoice");
const mail = require("../../util/mail");
const generatePDF = require("../../util/generatePDF");
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
					vat: attendee.isFlaw ? 0 : conference.ticketPrice * process.env.VAT,
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
					}. The conference is beginning on ${conference.start.toLocaleString()} and ending on ${conference.end.toLocaleString()}.`,
					comment: `The hosting organisation is reserving the right to cancel attendee registration in case of not paying the fee in due time.`,
				},
				conferenceId: conference._id,
				userId: attendee._id,
			});
			//console.log(invoice);

			//save invoice
			//create attendee object and push to conference.attendees array
			//save conference

			// we are using headless mode

			const attachments = [
				{
					filename: "Invoice.pdf",
					content: await generatePDF(invoiceTemplate(invoice)),
				},
			];

			const send = await mail(
				attendee.email,
				`${conference.name} Invoice`,
				`Dear ${attendee.fullName},\n\nYou have been successfully registered to conference: ${conference.name}.\nThe hosting organisation is reserving the right to cancel attendee registration in case of not paying the fee in due time.\nInvoice in PDF format can be found in attachments.\n\nThis email has been generated by FlawCS system, please do not reply.`,
				invoiceTemplate(invoice),
				attachments
			);
			console.log(send);
			if (send.rejected.length === 0) {
				console.log("mail sent successfully");
			}

			return conference;
		},
	},
};
