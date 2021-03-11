const userResolver = require("./user");
const submissionResolver = require("./submission");
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
		...submissionResolver.Query,
		...conferenceResolver.Query,
		...hostResolver.Query,
	},
	Mutation: {
		...userResolver.Mutation,
		...submissionResolver.Mutation,
		...conferenceResolver.Mutation,
		...hostResolver.Mutation,
		...utilResolver.Mutation,
	},
};
