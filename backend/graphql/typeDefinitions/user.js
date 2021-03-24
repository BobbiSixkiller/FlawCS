const { gql } = require("apollo-server-express");

module.exports = gql`
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		fullName: String
		email: String!
		telephone: String!
		organisation: String!
		billing: Billing!
		address: Address!
		token: String
		role: String!
		createdAt: Date!
		updatedAt: Date!
		submissions: [Submission]!
	}
	type Billing {
		name: String!
		ICO: String
		ICDPH: String
		DIC: String
	}

	input RegisterInput {
		firstName: String!
		lastName: String!
		password: String!
		confirmPassword: String!
		email: String!
		telephone: String!
		organisation: String!
		titleBefore: String
		titleAfter: String
	}
	input BillingInput {
		name: String!
		DIC: String
		ICO: String
		ICDPH: String
	}

	type Query {
		getUsers: [User]!
		getUser(userId: ID!): User!
	}
	extend type Mutation {
		register(
			registerInput: RegisterInput!
			addressInput: AddressInput!
			billingInput: BillingInput!
		): User!
		login(email: String!, password: String!): User!
		updateUser(
			userId: ID!
			role: String!
			userInput: RegisterInput!
			addressInput: AddressInput!
			billingInput: BillingInput!
		): User!
		deleteUser(userId: ID!): String!
	}
`;
