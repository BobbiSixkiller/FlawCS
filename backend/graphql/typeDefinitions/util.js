const { gql } = require("apollo-server-express");

module.exports = gql`
	scalar Date
	scalar Upload

	type File {
		url: String!
	}

	type Address {
		street: String!
		city: String!
		postal: String!
		country: String!
	}

	input AddressInput {
		street: String!
		city: String!
		postal: String!
		country: String!
	}

	type Mutation {
		uploadFile(file: Upload!): File!
	}
`;
