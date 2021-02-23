const { gql } = require("apollo-server");

module.exports = gql`
	scalar Date

	#vytvorit address input, ktory by sa dal dedit medzi dalsimi inputmi
	type Address {
		street: String!
		city: String!
		postal: String!
		country: String!
		createdAt: Date!
		updatedAt: Date!
	}
`;
