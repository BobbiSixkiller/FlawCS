const { Schema, model } = require("mongoose");
const { address } = require("./utilSchemas");

const invoiceSchema = new Schema(
	{
		issuer: {
			name: String,
			address,
			ICO: String,
			ICDPH: String,
			DIC: String,
			IBAN: String,
			SWIFT: String,
			logoUrl: String,
			signatureUrl: String,
		},
		payer: {
			name: String,
			address,
			ICO: String,
			ICDPH: String,
			DIC: String,
		},
		invoice: {
			type: String,
			issueDate: Date,
			DPHDate: Date,
			dueDate: Date,
			body: String,
			comment: String,
			payment: {
				form: String,
				variableSymbol: Number,
				constantSymbol: Number,
				ticketPrice: Number,
				tax: Number,
			},
		},
		conferenceId: { type: Schema.Types.ObjectId, ref: "Conference" },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = model("Invoice", invoiceSchema);
