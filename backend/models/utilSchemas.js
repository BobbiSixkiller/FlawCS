const { Schema } = require("mongoose");

module.exports.address = new Schema(
	{
		street: String,
		city: String,
		postal: String,
		country: String,
	},
	{ timestamps: true }
);
