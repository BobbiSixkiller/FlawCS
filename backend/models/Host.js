const { model, Schema } = require("mongoose");
const location = require("./utilSchemas/location");

const hostSchema = new Schema(
	{
		location: location,
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
