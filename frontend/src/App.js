import React from "react";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

import Upload from "./components/Upload";

const client = new ApolloClient({
	link: createUploadLink({ uri: "http://localhost:5000/graphql" }),
	cache: new InMemoryCache(),
});

function App() {
	return (
		<ApolloProvider client={client}>
			<Upload />
		</ApolloProvider>
	);
}

export default App;
