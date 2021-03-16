const { gql } = require("apollo-server-express");

module.exports = gql`
	type Section {
		id: ID!
		name: String!
		topic: String!
		start: Date
		end: Date
		garants: [Garant]!
		coordinators: [Coordinator]!
		speakers: [Speaker]!
		createdAt: Date!
		updatedAt: Date!
	}
	type Speaker {
		id: ID!
		name: String!
		userId: String!
		submission: String!
		accepted: Boolean!
		createdAt: Date!
		updatedAt: Date!
	}
	type Garant {
		id: ID!
		name: String!
		userId: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Coordinator {
		id: ID!
		name: String!
		userId: String!
		createdAt: Date!
		updatedAt: Date!
	}

	extend type Query {
		getSections(conferenceId: ID!): [Section]!
		getSection(sectionId: ID!): Section!
	}
	extend type Mutation {
		createSection(
			conferenceId: ID!
			name: String!
			topic: String!
			start: Date
			end: Date
		): Conference!
		updateSection(
			conferenceId: ID!
			sectionId: ID!
			name: String!
			topic: String!
			start: Date
			end: Date
		): Section!
		deleteSection(sectionId: ID!): String!
		#REFACTOR ZVYSOK
		addGarant(sectionId: ID!, name: String!, userId: String!): Section!
		deleteGarant(sectionId: ID!, userId: ID!): Section!
		addCoordinator(sectionId: ID!, name: String!, userId: String!): Section!
		deleteCoordinator(sectionId: ID!, userId: ID!): Section!
		addSubmission(sectionId: ID!, submissionInput: SubmissionInput!): Section!
		addSpeaker(
			sectionId: ID!
			userId: String!
			name: String!
			submissionInput: SubmissionInput!
		): Section!
		deleteSpeaker(sectionId: ID!, userId: ID!): Section!
		approveSpeaker(sectionId: ID!, userId: ID!): Section!
	}
`;
