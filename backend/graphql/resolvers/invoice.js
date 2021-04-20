const { UserInputError } = require("apollo-server-express");

const Invoice = require("../../models/Invoice");

module.exports = {
	Query: {
		async getInvoice(_, { invoiceId }) {
			const invoice = await Invoice.findOne({ _id: invoiceId });
			if (!invoice) {
				throw new UserInputError("Invoice not found.");
			}

			return invoice;
		},
	},
	Mutation: {
		async updateInvoice(_, { invoiceId }) {},
	},
};
