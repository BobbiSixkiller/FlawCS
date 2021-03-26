const { gql } = require("apollo-server-express");
module.exports = gql`
	type Host {
		id: ID!
		billing: Billing!
		signatureUrl: String!
		logoUrl: String!
		createdAt: Date!
		updatedAt: Date!
	}

	input HostInput {
		billing: BillingInput!
		signatureUrl: String!
		logoUrl: String!
	}

	extend type Query {
		getHosts: [Host]!
		getHost(hostId: ID!): Host!
	}
	extend type Mutation {
		createHost(hostInput: HostInput!): Host!
		updateHost(hostId: ID!, hostInput: HostInput!): Host!
		deleteHost(hostId: ID!): String!
	}
`;
