const userResolver = require("./user");
const conferenceResolver = require("./conference");
const hostResolver = require("./host");
const utilResolver = require("./util");

const { Date } = require("../customScalars");
const { GraphQLUpload } = require("graphql-upload");

module.exports = {
	Date: Date,
	Upload: GraphQLUpload,
	Query: {
		...userResolver.Query,
		...conferenceResolver.Query,
		...hostResolver.Query,
	},
	Mutation: {
		...userResolver.Mutation,
		...conferenceResolver.Mutation,
		...hostResolver.Mutation,
		...utilResolver.Mutation,
	},
};
