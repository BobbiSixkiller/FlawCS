const { gql } = require("apollo-server-express");

module.exports = gql`
	type Invoice {
		id: ID!
		issuer: Issuer!
		payer: Billing!
		invoice: InvoiceData!
		userId: ID!
		conferenceId: ID!
		createdAt: Date!
		updatedAt: Date!
	}
	type Issuer {
		billing: Billing!
		logoUrl: String!
		signatureUrl: String!
	}
	type InvoiceData {
		type: String!
		issueDate: Date!
		vatDate: Date!
		dueDate: Date!
		variableSymbol: String!
		ticketPrice: Float!
		vat: Float!
		body: String!
		comment: String!
	}

	input Invoice {
		
	}

	extend type Query {
		getInvoice(invoiceId: ID!): Invoice!
	}
	extend type Mutation {
		updateInvoice(invoiceId: ID!): Invoice!
	}
`;
