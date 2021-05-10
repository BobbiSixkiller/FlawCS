const { UserInputError } = require("apollo-server-express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

module.exports = {
	MutationResponse: {
		__resolveType(mutationRes, context, info) {
			if (mutationRes.conference) {
				return "Conference";
			}

			return null; // GraphQLError is thrown
		},
	},
	Mutation: {
		async uploadFile(parent, { file }) {
			const { createReadStream, filename, mimetype, encoding } = await file;

			if (
				mimetype != "application/pdf" &&
				mimetype !=
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
				mimetype !== "image/jpeg"
			) {
				throw new UserInputError("Supported file types: PDF, Word, jpeg");
			}

			const url = `/images/${
				uuidv4() + "-" + filename.toLowerCase().split(" ").join("-")
			}`;

			await new Promise((res, reject) =>
				createReadStream()
					.pipe(fs.createWriteStream(path.join(process.cwd(), "/public", url)))
					.on("close", res)
					.on("error", reject)
			);

			return { url: `${process.env.BASE_URL + url}` };
		},
	},
};
