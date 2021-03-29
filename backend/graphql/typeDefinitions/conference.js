const { gql } = require("apollo-server-express");

module.exports = gql`
	type Venue {
		name: String!
		address: Address!
	}
	type Conference {
		id: ID!
		name: String!
		start: Date!
		end: Date!
		regStart: Date!
		regEnd: Date!
		venue: Venue!
		host: Host
		ticketPrice: Float!
		variableSymbol: Int!
		sections: [ConferenceSection]!
		attendees: [Attendee]!
		createdAt: Date!
		updatedAt: Date!
	}
	type ConferenceSection {
		id: ID!
		sectionId: ID!
		name: String!
		topic: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Attendee {
		id: ID!
		name: String!
		userId: ID!
		invoiceId: String!
		createdAt: Date!
		updatedAt: Date!
	}

	input ConferenceInput {
		name: String!
		hostId: ID!
		start: Date!
		end: Date!
		regStart: Date!
		regEnd: Date!
		ticketPrice: Float!
		variableSymbol: Int!
	}
	input VenueInput {
		name: String!
		address: AddressInput!
	}

	extend type Query {
		getUpcomingConferences(hostId: ID): [Conference]!
		getConferences(hostId: ID): [Conference]!
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
		addAttendee(conferenceId: ID!, userId: ID!): Conference!
		removeAttendee(conferenceId: ID!, userId: ID!): Conference!
	}
`;
