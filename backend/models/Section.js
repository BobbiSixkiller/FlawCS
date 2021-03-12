const { Schema, model } = require("mongoose");

const garantSchema = new Schema(
	{
		name: String,
		garant: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const coordinatorSchema = new Schema(
	{
		name: String,
		coordinator: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const speakerSchema = new Schema(
	{
		name: String,
		speaker: { type: Schema.Types.ObjectId, ref: "User" },
		submission: { type: Schema.Types.ObjectId, ref: "Submission" },
		accepted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const sectionSchema = new Schema(
	{
		name: String,
		topic: String,
		start: Date,
		end: Date,
		garants: [garantSchema],
		coordinators: [coordinatorSchema],
		speakers: [speakerSchema],
	},
	{ timestamps: true }
);

module.exports = model("Section", sectionSchema);
