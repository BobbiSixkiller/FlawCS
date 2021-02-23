const { gql } = require("apollo-server");

module.exports = gql`
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
		token: String
		role: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Billing {
		name: String!
		address: Address
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
		role: String
	}
	input BillingInput {
		name: String!
		DIC: String
		ICO: String
		ICDPH: String
		street: String!
		city: String!
		postal: String!
		country: String!
	}

	type Query {
		getUsers: [User]
		getUser(userId: ID!): User
	}
	type Mutation {
		register(registerInput: RegisterInput, billingInput: BillingInput): User!
		login(email: String!, password: String!): User!
		updateUser(
			userId: ID!
			userInput: RegisterInput
			billingInput: BillingInput
		): User!
		deleteUser(userId: ID!): String!
	}
`;
