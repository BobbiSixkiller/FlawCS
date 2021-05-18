const { gql } = require("apollo-server-express");

module.exports = gql`
	enum Role {
		BASIC
		SUPERVISOR
		ADMIN
	}

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
		role: Role!
		createdAt: Date!
		updatedAt: Date!
		submissions: [Submission]!
	}
	type UserMutationRes implements MutationResponse {
		message: String!
		user: User
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
		register(
			registerInput: RegisterInput!
			billingInput: BillingInput!
		): UserMutationRes!
		login(email: String!, password: String!): UserMutationRes!
		updateUser(
			userId: ID!
			role: String!
			userInput: RegisterInput!
			billingInput: BillingInput!
		): UserMutationRes!
		deleteUser(userId: ID!): UserMutationRes!
	}
`;
