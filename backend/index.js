const { ApolloServer, makeExecutableSchema } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const authorization = require("./graphql/authorization");

const server = new ApolloServer({
	schema: applyMiddleware(
		makeExecutableSchema({ typeDefs, resolvers }),
		authorization
	),
	context: ({ req }) => ({ req }),
});

mongoose
	.connect(process.env.DB_DEV_ATLAS, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB connected!");
		return server.listen({ port: process.env.PORT });
	})
	.then((res) => {
		console.log(`Server is running at ${res.url}`);
	});
