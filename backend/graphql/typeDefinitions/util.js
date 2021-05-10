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
	type Billing {
		name: String!
		address: Address!
		DIC: String
		ICO: String
		ICDPH: String
		IBAN: String
		SWIFT: String
	}

	input AddressInput {
		street: String!
		city: String!
		postal: String!
		country: String!
	}
	input BillingInput {
		name: String!
		address: AddressInput!
		DIC: String
		ICO: String
		ICDPH: String
		IBAN: String
		SWIFT: String
	}

	type Mutation {
		uploadFile(file: Upload!): File!
	}

	interface MutationResponse {
		#code: String!
		#success: Boolean!
		message: String!
	}
`;
