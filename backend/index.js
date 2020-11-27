const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = gql`
    type Query{
        sayHi: String!
    }
`;

const resolvers = {
    Query: {
        sayHi() {
            return "Hello world!"
        }
    }
};

const server = new ApolloServer({
    typeDefs, resolvers
});

mongoose.connect(process.env.DB_DEV_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected!");
        return server.listen({port: process.env.PORT});
    })
    .then(res => {
        console.log(`Server is running at ${res.url}`);
    });