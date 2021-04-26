const { UserInputError } = require("apollo-server-express");

const Invoice = require("../../models/Invoice");

module.exports = {
	Query: {
		async getInvoices(_, { conferenceId }) {
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
		async downloadInvoice(_, { invoiceId }) {},
	},
	Mutation: {
		async updateInvoice(_, { invoiceId }) {},
	},
};
