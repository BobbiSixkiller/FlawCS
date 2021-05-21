const { gql } = require("apollo-server-express");

module.exports = gql`
	type Submission {
		id: ID!
		authors: [User]!
		conferenceId: ID!
		sectionId: ID!
		name: String!
		abstract: String!
		keywords: [String]!
		url: String
		accepted: Boolean!
		createdAt: Date!
		updatedAt: Date!
	}
	type SubmissionMutationRes implements MutationResponse {
		message: String!
		submission: Submission
	}

	input SubmissionInput {
		name: String!
		authors: [ID]!
		abstract: String!
		keywords: [String]!
		url: String
	}

	extend type Query {
		#development query, might not be needed in production
		getSubmissions: [Submission]!
		getSubmission(submissionId: ID!): Submission!
	}
	extend type Mutation {
		updateSubmission(
			submissionId: ID!
			submissionInput: SubmissionInput!
			accepted: Boolean!
		): SubmissionMutationRes!
		deleteSubmission(submissionId: ID!): SubmissionMutationRes!
	}
`;
