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
		invoice: {
			type: { type: String, trim: true },
			issueDate: Date,
			vatDate: Date,
			dueDate: Date,
			variableSymbol: { type: String, trim: true },
			ticketPrice: Number,
			vat: Number,
			body: { type: String, trim: true },
			comment: { type: String, trim: true },
		},
		conferenceId: { type: Schema.Types.ObjectId, ref: "Conference" },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

invoiceSchema.pre("save", async function () {
	console.log(this);
});

module.exports = model("Invoice", invoiceSchema);
