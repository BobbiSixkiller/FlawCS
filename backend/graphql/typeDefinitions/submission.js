const { gql } = require("apollo-server-express");

module.exports = gql`
	type Submission {
		id: ID!
		userId: ID!
		conferenceId: ID!
		name: String!
		abstract: String!
		keywords: [String]!
		url: String
		createdAt: Date!
		updatedAt: Date!
	}

	input SubmissionInput {
		name: String!
		abstract: String!
		keywords: [String]!
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
