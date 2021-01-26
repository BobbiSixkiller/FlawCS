const { Schema, Model } = require("mongoose");

const invoiceSchema = new Schema(
	{
		issuer: {},
		payer: {},
		payment: {
			variableSymbol: Number,
			constantSymbol: Number,
			ticketPrice: Number,
			tax: Number,
			text: String,
		},
		conference: { type: Schema.Types.ObjectId, ref: "Conference" },
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = Model("Invoice", invoiceSchema);
