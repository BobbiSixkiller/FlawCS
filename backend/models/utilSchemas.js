const { Schema } = require("mongoose");

module.exports.address = new Schema({
	street: { type: String, trim: true },
	city: { type: String, trim: true },
	postal: { type: String, trim: true },
	country: { type: String, trim: true },
});

module.exports.billing = new Schema({
	name: { type: String, trim: true },
	ICO: { type: String, trim: true },
	DIC: { type: String, trim: true },
	ICDPH: { type: String, trim: true },
});
