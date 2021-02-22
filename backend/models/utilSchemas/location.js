const { Schema } = require("mongoose");
const address = require("./address");

module.exports = new Schema({
	name: String,
	address: { address },
});
