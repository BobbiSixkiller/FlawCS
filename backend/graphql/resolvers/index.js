const userResolver = require("./user");
const conferenceResolver = require("./conference");
const hostResolver = require("./host");
const { Date } = require("../customScalars");

module.exports = {
	Date: Date,
	Query: {
		...userResolver.Query,
		...conferenceResolver.Query,
		...hostResolver.Query,
	},
	Mutation: {
		...userResolver.Mutation,
		...conferenceResolver.Mutation,
		...hostResolver.Mutation,
	},
};
