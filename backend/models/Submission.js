const { SchemaError } = require("apollo-server-express");
const { Mongoose } = require("mongoose");

const { Schema, model } = require("mongoose");

const submissionSchema = new Schema(
	{
		name: String,
		abstract: String,
		keywords: [{ keyword: String }],
		url: String,
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = model("Submission", submissionSchema);
