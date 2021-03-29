const { Schema, model } = require("mongoose");
const { billing } = require("./utilSchemas");

const invoiceSchema = new Schema(
	{
		issuer: {
			billing,
			logoUrl: { type: String, trim: true },
			signatureUrl: { type: String, trim: true },
		},
		payer: billing,
		payment: {
			variableSymbol: { type: String, trim: true },
			ticketPrice: Number,
			tax: Number,
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
