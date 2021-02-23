const { Schema, Model } = require("mongoose");
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
			stampUrl: String,
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
		conference: { type: Schema.Types.ObjectId, ref: "Conference" },
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = Model("Invoice", invoiceSchema);
