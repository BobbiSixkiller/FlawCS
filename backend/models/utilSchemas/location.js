const { Schema } = require("mongoose");

module.exports = new Schema(
	{
		name: String,
		street: String,
		city: String,
		postal: String,
		country: String,
	},
	{ timestamps: true }
);
