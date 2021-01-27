const { gql } = require("apollo-server");

module.exports = gql`
	scalar Date
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		email: String!
		telephone: String!
		organisation: String!
		titleBefore: String!
		titleAfter: String!
		billing: Billing!
		token: String!
		role: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Billing {
		name: String
		address: Address
		ICO: String
		DIC: String
	}
	type Address {
		street: String
		city: String
		postalCode: String
		country: String
	}
	type Location {
		name: String
		address: Address!
		createdAt: Date
		updatedAt: Date
	}
	type Host {
		name: String
		address: Location!
		ICO: String
		DIC: String
		IBAN: String
		SWIFT: String
		stampUrl: String
		createdAt: Date
		updatedAt: Date
	}
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
	type Conference {
		id: ID!
		name: String!
		start: Date!
		end: Date!
		location: Location!
		host: Host!
		ticketPrice: Int!
		sections: [Section]!
		attendees: [User]!
		createdAt: Date!
		updatedAt: Date!
	}
	input RegisterInput {
		firstName: String!
		lastName: String!
		password: String!
		confirmPassword: String!
		email: String!
		telephone: String!
		organisation: String!
		titleBefore: String!
		titleAfter: String!
	}
	type Query {
		getUsers: [User]
		getUser(userId: ID!): User
		getConferences: [Conference]
		getConference(conferenceId: ID!): Conference
	}
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(email: String!, password: String!): User!
		editUser(userId: ID!): User!
		deleteUser(userId: ID!): String!
	}
`;
