const { gql } = require("apollo-server");
module.exports = gql`
	type Host {
		name: String!
		address: Location
		ICO: String!
		ICDPH: String!
		DIC: String!
		IBAN: String!
		SWIFT: String!
		stampUrl: String!
		createdAt: Date!
		updatedAt: Date!
	}

	input LocationInput {
		name: String!
		street: String!
		city: String!
		postal: String!
		country: String!
	}
	input HostInput {
		name: String!
		ICO: String!
		ICDPH: String!
		DIC: String!
		IBAN: String!
		SWIFT: String!
		stampUrl: String!
	}
`;
