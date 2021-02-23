const { gql } = require("apollo-server");
module.exports = gql`
	type Host {
		id: ID!
		name: String!
		address: Address
		ICO: String!
		ICDPH: String!
		DIC: String!
		IBAN: String!
		SWIFT: String!
		stampUrl: String!
		createdAt: Date!
		updatedAt: Date!
	}

	input HostInput {
		name: String!
		street: String!
		city: String!
		postal: String!
		country: String!
		ICO: String!
		ICDPH: String!
		DIC: String!
		IBAN: String!
		SWIFT: String!
		stampUrl: String!
	}

	extend type Query {
		getHosts: [Host]
		getHost(hostId: ID!): Host
	}
	extend type Mutation {
		createHost(hostInput: HostInput): Host!
		updateHost(hostId: ID!, hostInput: HostInput): Host!
		deleteHost(hostId: ID!): String!
	}
`;
