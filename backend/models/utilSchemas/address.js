const { Schema } = require("mongoose");

module.exports = new Schema(
	{
		street: String,
		city: String,
		postal: String,
		country: String,
	},
	{ timestamps: true }
);
