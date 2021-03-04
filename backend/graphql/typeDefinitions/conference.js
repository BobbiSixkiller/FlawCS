const { gql } = require("apollo-server-express");

module.exports = gql`
	type Speaker {
		id: ID!
		name: String!
		speaker: String!
		submission: Submission!
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
	type Attendee {
		id: ID!
		name: String!
		attendee: String!
		invoiceId: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Submission {
		name: String!
		abstract: String!
		keywords: String!
		url: String
	}
	type Section {
		id: ID!
		name: String!
		topic: String!
		garants: [Garant]!
		speakers: [Speaker]!
		createdAt: Date!
		updatedAt: Date!
	}
	type Venue {
		name: String!
		address: Address
	}
	type Conference {
		id: ID!
		name: String!
		start: Date!
		end: Date!
		regStart: Date!
		regEnd: Date!
		venue: Venue
		host: Host
		ticketPrice: Int!
		sections: [Section]!
		attendees: [Attendee]!
		createdAt: Date!
		updatedAt: Date!
	}

	input ConferenceInput {
		name: String!
		hostId: String!
		start: Date!
		end: Date!
		regStart: Date!
		regEnd: Date!
		ticketPrice: Float!
	}
	input VenueInput {
		name: String!
		address: AddressInput
	}

	extend type Query {
		getConferences: [Conference]!
		getConference(conferenceId: ID!): Conference!
	}
	extend type Mutation {
		createConference(
			conferenceInput: ConferenceInput!
			venueInput: VenueInput!
		): Conference!
		updateConference(
			conferenceId: ID!
			conferenceInput: ConferenceInput!
			venueInput: VenueInput!
		): Conference!
		deleteConference(conferenceId: ID!): String!
		#otestovat spravanie pri apollo clientovi ci bude cashovat tak ze spoji Section object s Conference objectom pokial mutacia vrati len Section object
		addSection(conferenceId: ID!, name: String!, topic: String!): Conference!
		updateSection(
			conferenceId: ID!
			sectionId: ID!
			name: String!
			topic: String!
		): Conference!
		deleteSection(conferenceId: ID!, sectionId: ID!): Conference!
		addGarant(
			conferenceId: ID!
			sectionId: ID!
			name: String!
			garant: String!
		): Conference!
		updateGarant(
			conferenceId: ID!
			sectionId: ID!
			garantId: ID!
			name: String!
			garant: String!
		): Conference!
		deleteGarant(conferenceId: ID!, sectionId: ID!, garantId: ID!): Conference!
	}
`;
