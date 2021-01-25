const { Schema, Model } = require("mongoose");

const invoiceSchema = new Schema(
	{
		name: String,
		variableSymbol: String,
		conference: { type: Schema.Types.ObjectId, ref: "Conference" },
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = Model("Invoice", invoiceSchema);
