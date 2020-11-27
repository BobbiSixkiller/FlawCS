const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        createdAt: String!
        updatedAt: String!
    }
    type Conference {
        id: ID!
        attendees: [User]
        createdAt: String!
        updatedAt: String!
    }
    type Query {
        getUsers: [User]
        getConferences: [Conference]
    }
`;

