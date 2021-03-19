const { gql } = require("apollo-server-express");

module.exports = gql`
	type Section {
		id: ID!
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

	input SectionInput {
		name: String!
		topic: String!
		start: Date
		end: Date
		languages: [String]!
	}

	extend type Query {
		getSections(conferenceId: ID!): [Section]!
		getSection(sectionId: ID!): Section!
	}
	extend type Mutation {
		createSection(conferenceId: ID!, sectionInput: SectionInput!): Conference!
		updateSection(sectionId: ID!, sectionInput: SectionInput!): Section!
		deleteSection(sectionId: ID!): String!
		addGarant(sectionId: ID!, name: String!, userId: String!): Section!
		removeGarant(sectionId: ID!, userId: ID!): Section!
		addCoordinator(sectionId: ID!, name: String!, userId: String!): Section!
		removeCoordinator(sectionId: ID!, userId: ID!): Section!
		addSubmission(
			conferenceId: ID!
			sectionId: ID!
			authors: [ID]
			submissionInput: SubmissionInput!
		): Section!
	}
`;
