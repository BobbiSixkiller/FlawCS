const { gql } = require("apollo-server-express");

module.exports = gql`
	type Submission {
		id: ID!
		name: String!
		abstract: String!
		keywords: [Keyword]!
		url: String
	}

	extend type Query {
		getSubmissions: [Submission]!
		getSubmission(submissionId: ID!): Submission!
	}
	extend type Mutation {
		updateSubmission(submissionId: ID!): Submission!
	}
`;
