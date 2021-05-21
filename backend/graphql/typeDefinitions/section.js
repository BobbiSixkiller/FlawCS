const { gql } = require("apollo-server-express");

module.exports = gql`
	type Section {
		id: ID!
		conferenceId: ID!
		name: String!
		topic: String!
		start: Date
		end: Date
		languages: [String]!
		garants: [Garant]!
		coordinators: [Coordinator]!
		submissions: [SectionSubmission]!
		createdAt: Date!
		updatedAt: Date!
	}
	type SectionSubmission {
		id: ID!
		name: String!
		submissionId: ID!
		accepted: Boolean!
		createdAt: Date!
		updatedAt: Date!
	}
	type Garant {
		id: ID!
		name: String!
		userId: ID!
		createdAt: Date!
		updatedAt: Date!
	}
	type Coordinator {
		id: ID!
		name: String!
		userId: ID!
		createdAt: Date!
		updatedAt: Date!
	}
	type SectionMutationRes implements MutationResponse {
		message: String!
		conference: Conference
		section: Section
		submission: Submission
	}

	input SectionInput {
		name: String!
		topic: String!
		start: Date
		end: Date
		languages: [String]!
	}

	extend type Query {
		getConferenceSections(conferenceId: ID!): [Section]!
		getSection(sectionId: ID!): Section!
	}
	extend type Mutation {
		createSection(
			conferenceId: ID!
			sectionInput: SectionInput!
		): SectionMutationRes!
		updateSection(
			sectionId: ID!
			sectionInput: SectionInput!
		): SectionMutationRes!
		deleteSection(sectionId: ID!): SectionMutationRes!
		addGarant(
			sectionId: ID!
			name: String!
			userId: String!
		): SectionMutationRes!
		removeGarant(sectionId: ID!, garantId: ID!): SectionMutationRes!
		addCoordinator(
			sectionId: ID!
			name: String!
			userId: String!
		): SectionMutationRes!
		removeCoordinator(sectionId: ID!, coordinatorId: ID!): SectionMutationRes!
		addSubmission(
			conferenceId: ID!
			sectionId: ID!
			submissionInput: SubmissionInput!
		): SectionMutationRes!
	}
`;
