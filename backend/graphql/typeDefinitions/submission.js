const { gql } = require("apollo-server-express");

module.exports = gql`
	type Submission {
		id: ID!
		user: String!
		conference: String!
		name: String!
		abstract: String!
		keywords: [Keyword]!
		url: String
		createdAt: Date!
		updatedAt: Date!
	}
	type Keyword {
		id: ID!
		keyword: String!
	}

	input KeywordInput {
		keyword: String!
	}
	input SubmissionInput {
		name: String!
		abstract: String!
		keywords: [KeywordInput]!
		url: String
	}

	extend type Query {
		getSubmissions: [Submission]!
		getSubmission(submissionId: ID!): Submission!
	}
	extend type Mutation {
		updateSubmission(
			submissionId: ID!
			submissionInput: SubmissionInput!
		): Submission!
		deleteSubmission(submissionId: ID!): String!
	}
`;
