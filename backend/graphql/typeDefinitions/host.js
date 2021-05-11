const { gql } = require("apollo-server-express");

module.exports = gql`
	type Host {
		id: ID!
		name: String!
		billing: Billing!
		signatureUrl: String!
		logoUrl: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type HostMutationRes implements MutationResponse {
		message: String!
		host: Host
	}

	input HostInput {
		name: String!
		billing: BillingInput!
		signatureUrl: String!
		logoUrl: String!
	}

	extend type Query {
		getHosts: [Host]!
		getHost(hostId: ID!): Host!
	}
	extend type Mutation {
		createHost(hostInput: HostInput!): HostMutationRes!
		updateHost(hostId: ID!, hostInput: HostInput!): HostMutationRes!
		deleteHost(hostId: ID!): HostMutationRes!
	}
`;
