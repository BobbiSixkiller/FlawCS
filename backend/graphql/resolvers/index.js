const userResolver = require("./user");
const invoiceResolver = require("./invoice");
const submissionResolver = require("./submission");
const conferenceResolver = require("./conference");
const sectionResolver = require("./section");
const hostResolver = require("./host");
const utilResolver = require("./util");

const { Date } = require("../customScalars");
const { GraphQLUpload } = require("graphql-upload");

module.exports = {
	Date: Date,
	Upload: GraphQLUpload,
	Query: {
		...userResolver.Query,
		...invoiceResolver.Query,
		...submissionResolver.Query,
		...conferenceResolver.Query,
		...sectionResolver.Query,
		...hostResolver.Query,
	},
	Mutation: {
		...userResolver.Mutation,
		...invoiceResolver.Mutation,
		...submissionResolver.Mutation,
		...conferenceResolver.Mutation,
		...sectionResolver.Mutation,
		...hostResolver.Mutation,
		...utilResolver.Mutation,
	},
};
