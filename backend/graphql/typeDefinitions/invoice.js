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

	input InvoiceInputData {
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
	input InvoiceInput {
		issuer: HostInput!
		payer: BillingInput!
		invoice: InvoiceInputData!
	}

	extend type Query {
		getInvoice(invoiceId: ID!, userId: ID): Invoice!
		getInvoices(conferenceId: ID!): [Invoice]!
		downloadInvoice(invoiceId: ID!, userId: ID): String!
	}
	extend type Mutation {
		updateInvoice(invoiceId: ID!, invoiceInput: InvoiceInput!): Invoice!
	}
`;
