const { model, Schema } = require("mongoose");
const { address } = require("./utilSchemas");

const hostSchema = new Schema(
	{
		name: { type: String, trim: true },
		address,
		ICO: { type: String, trim: true },
		ICDPH: { type: String, trim: true },
		DIC: { type: String, trim: true },
		IBAN: { type: String, trim: true },
		SWIFT: { type: String, trim: true },
		signatureUrl: String,
		logoUrl: String,
	},
	{ timestamps: true }
);

hostSchema.virtual("conferences", {
	ref: "Host",
	localField: "_id",
	foreignField: "host",
	justOne: false,
});

module.exports = model("Host", hostSchema);
