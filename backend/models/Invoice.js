const { Schema, model } = require("mongoose");
const { address } = require("./utilSchemas");

const invoiceSchema = new Schema(
	{
		issuer: {
			name: { type: String, trim: true },
			address,
			ICO: { type: String, trim: true },
			ICDPH: { type: String, trim: true },
			DIC: { type: String, trim: true },
			IBAN: { type: String, trim: true },
			SWIFT: { type: String, trim: true },
			logoUrl: { type: String, trim: true },
			signatureUrl: { type: String, trim: true },
		},
		payer: {
			name: { type: String, trim: true },
			address,
			ICO: { type: String, trim: true },
			ICDPH: { type: String, trim: true },
			DIC: { type: String, trim: true },
		},
		payment: {
			form: { type: String, trim: true },
			variableSymbol: { type: String, trim: true },
			constantSymbol: { type: String, trim: true },
			ticketPrice: { type: String, trim: true },
			tax: { type: String, trim: true },
		},
		invoice: {
			type: { type: String, trim: true },
			issueDate: Date,
			DPHDate: Date,
			dueDate: Date,
			body: { type: String, trim: true },
			comment: { type: String, trim: true },
		},
		conferenceId: { type: Schema.Types.ObjectId, ref: "Conference" },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = model("Invoice", invoiceSchema);
