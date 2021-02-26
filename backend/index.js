const { ApolloServer, makeExecutableSchema } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload"); // The Express upload middleware.
const express = require("express");

const cors = require("cors");
const { applyMiddleware } = require("graphql-middleware");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefinitions");
const resolvers = require("./graphql/resolvers");
const checkAuth = require("./util/checkAuth");
const authorization = require("./graphql/authorization");

const app = new express();
app.use(graphqlUploadExpress());
app.use(express.static("public"));
app.use(cors());

const server = new ApolloServer({
	schema: applyMiddleware(
		makeExecutableSchema({ typeDefs, resolvers }),
		authorization
	),
	context: ({ req }) => {
		const user = checkAuth(req);

		return { user };
	},
	//disable baked-in upload scalar in order to replace it with graphql-upload package
	uploads: false,
});
server.applyMiddleware({ app });

mongoose
	.connect(process.env.DB_DEV_ATLAS, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("MongoDB connected!");
		return app.listen({ port: process.env.PORT }, () =>
			console.log(
				`Server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`
			)
		);
	});
