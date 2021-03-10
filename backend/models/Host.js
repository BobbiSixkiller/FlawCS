const { model, Schema } = require("mongoose");
const { address } = require("./utilSchemas");

const hostSchema = new Schema(
	{
		name: String,
		address,
		ICO: String,
		ICDPH: String,
		DIC: String,
		IBAN: String,
		SWIFT: String,
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
