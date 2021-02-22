const { ApolloServer } = require("apollo-server");

const { gql } = require("apollo-server");

module.exports = gql`
	scalar Date

	type Address {
		street: String!
		city: String!
		postal: String!
		country: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type Location {
		name: String!
		address: Address!
	}
`;
