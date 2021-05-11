const { UserInputError } = require("apollo-server-express");
const fs = require("fs");
const generatePDF = require("../../util/pdf");
const invoiceTemplate = require("../../util/invoice");

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
		async downloadInvoice(_, { invoiceId }) {
			const invoice = await Invoice.findOne({ _id: invoiceId });
			if (!invoice) {
				throw new UserInputError("Invoice not found.");
			}
			const { pdf, path } = await generatePDF(invoiceTemplate(invoice));

			fs.createReadStream(path);

			return "Invoice downloaded!";
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
