const { Schema } = require("mongoose");

const address = new Schema({
	street: { type: String, trim: true, required: [true, "STREET KING"] },
	city: { type: String, trim: true },
	postal: { type: String, trim: true },
	country: { type: String, trim: true },
});

const billing = new Schema({
	name: {
		type: String,
		trim: true,
		required: [true, "Billing name required!!!"],
		maxLength: [3, "No more than 3 chars allowed!!"],
	},
	ICO: { type: String, trim: true },
	DIC: { type: String, trim: true },
	ICDPH: { type: String, trim: true },
	IBAN: { type: String, trim: true },
	SWIFT: { type: String, trim: true },
	address,
});

module.exports = { address, billing };
