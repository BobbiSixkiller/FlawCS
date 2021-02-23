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
		stampUrl: String,
	},
	{ timestamps: true }
);

module.exports = model("Host", hostSchema);
