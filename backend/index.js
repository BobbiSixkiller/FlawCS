require("dotenv").config();
const { ApolloServer, makeExecutableSchema } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload"); // The Express upload middleware.
const { applyMiddleware } = require("graphql-middleware");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const typeDefs = require("./graphql/typeDefinitions");
const resolvers = require("./graphql/resolvers");
const checkAuth = require("./util/checkAuth");
const authorization = require("./graphql/authorization");
const download = require("./rest/download");

const app = new express();
app.use(express.json());
app.use(graphqlUploadExpress());
app.use(express.static("public"));
app.use(cors());
app.use("/rest", download);

const server = new ApolloServer({
	schema: applyMiddleware(
		makeExecutableSchema({ typeDefs, resolvers }),
		authorization
	),
	context: ({ req }) => {
		const user = checkAuth(req);

		return { user };
	},
	// formatError(err) {
	// 	console.log(err);
	// 	if (err.originalError instanceof ValidationError) {
	// 		return new UserInputError("Different authentication error message!");
	// 	}
	// },
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
				`GraphQL server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`
			)
		);
	});
