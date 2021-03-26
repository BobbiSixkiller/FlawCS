const { gql } = require("apollo-server-express");

module.exports = gql`
	type User {
		id: ID!
		token: String
		fullName: String
		firstName: String!
		lastName: String!
		email: String!
		telephone: String!
		organisation: String!
		billing: Billing!
		role: String!
		createdAt: Date!
		updatedAt: Date!
		submissions: [Submission]!
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

	type Query {
		getUsers: [User]!
		getUser(userId: ID!): User!
	}
	extend type Mutation {
		register(registerInput: RegisterInput!, billingInput: BillingInput!): User!
		login(email: String!, password: String!): User!
		updateUser(
			userId: ID!
			role: String!
			userInput: RegisterInput!
			billingInput: BillingInput!
		): User!
		deleteUser(userId: ID!): String!
	}
`;
