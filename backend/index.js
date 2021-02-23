const { ApolloServer, makeExecutableSchema } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefinitions");
const resolvers = require("./graphql/resolvers");
const checkAuth = require("./util/checkAuth");
const authorization = require("./graphql/authorization");

const server = new ApolloServer({
	schema: applyMiddleware(
		makeExecutableSchema({ typeDefs, resolvers }),
		authorization
	),
	context: ({ req }) => {
		const user = checkAuth(req);

		return { user };
	},
});

mongoose
	.connect(process.env.DB_DEV_ATLAS, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("MongoDB connected!");
		return server.listen({ port: process.env.PORT });
	})
	.then((res) => {
		console.log(`Server is running at ${res.url}`);
	});
