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
		speaker: String!
		submission: String!
		accepted: Boolean!
		createdAt: Date!
		updatedAt: Date!
	}
	type Garant {
		id: ID!
		name: String!
		garant: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Coordinator {
		id: ID!
		name: String!
		coordinator: String!
		createdAt: Date!
		updatedAt: Date!
	}

	extend type Query {
		getSections: [Section]!
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
		addGarant(
			conferenceId: ID!
			sectionId: ID!
			name: String!
			garant: String!
		): Conference!
		deleteGarant(conferenceId: ID!, sectionId: ID!, garantId: ID!): Conference!
		addCoordinator(
			conferenceId: ID!
			sectionId: ID!
			name: String!
			coordinator: String!
		): Conference!
		deleteCoordinator(
			conferenceId: ID!
			sectionId: ID!
			coordinatorId: ID!
		): Conference!
		addSubmission(
			conferenceId: ID!
			sectionId: ID!
			submissionInput: SubmissionInput!
		): Conference!
		addSpeaker(
			conferenceId: ID!
			sectionId: ID!
			userId: String!
			name: String!
			submissionInput: SubmissionInput!
		): Conference!
		deleteSpeaker(
			conferenceId: ID!
			sectionId: ID!
			speakerId: ID!
		): Conference!
		approveSpeaker(
			conferenceId: ID!
			sectionId: ID!
			speakerId: ID!
		): Conference!
	}
`;
