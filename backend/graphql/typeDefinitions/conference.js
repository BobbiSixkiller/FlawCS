const { gql } = require("apollo-server-express");

module.exports = gql`
	type Speaker {
		id: ID!
		submission: Submission
		createdAt: Date!
		updatedAt: Date!
	}
	type Garant {
		id: ID!
		name: String!
		garantID: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Attendee {
		id: ID!
		name: String!
		attendeeID: String!
		invoiceID: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Submission {
		name: String!
		abstract: String!
		keywords: String!
		url: String
		reviewed: Boolean!
	}
	type Section {
		id: ID!
		name: String!
		title: String!
		garants: [User]!
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
		host: Host!
		ticketPrice: Int!
		sections: [Section]!
		attendees: [User]!
		createdAt: Date!
		updatedAt: Date!
	}

	input ConferenceInput {
		name: String!
		host: String!
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
		getConferences: [Conference]
		getConference(conferenceId: ID!): Conference
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
	}
`;
