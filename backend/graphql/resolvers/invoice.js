const { UserInputError } = require("apollo-server-express");

const Invoice = require("../../models/Invoice");

module.exports = {
	Query: {
		//development resolver, might not be needed in production
		async getConferenceInvoices(_, { conferenceId }) {
			const invoices = await Invoice.find({ conferenceId });

			return invoices;
		},
		async getInvoice(_, { invoiceId }) {
			const invoice = await Invoice.findOne({ _id: invoiceId });
			if (!invoice) {
				throw new UserInputError("Invoice not found.");
			}

			return invoice;
		},
	},
	Mutation: {
		async updateInvoice(_, { invoiceId, invoiceInput }) {
			const invoice = await Invoice.findOne({ _id: invoiceId });
			if (!invoice) {
				throw new UserInputError("Invoice not found.");
			}

			invoice.issuer = invoiceInput.issuer;
			invoice.payer = invoiceInput.payer;
			invoice.invoice = invoiceInput.invoice;

			await invoice.save();

			return {
				message: `Invoice has been updated.`,
				invoice,
			};
		},
	},
};
