const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs, 
    resolvers
});

mongoose.connect(process.env.DB_DEV_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected!");
        return server.listen({port: process.env.PORT});
    })
    .then(res => {
        console.log(`Server is running at ${res.url}`);
    });