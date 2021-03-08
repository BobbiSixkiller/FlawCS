const { model, Schema } = require("mongoose");
const { address } = require("./utilSchemas");

const attendeeSchema = new Schema(
	{
		name: String,
		attendee: { type: Schema.Types.ObjectId, ref: "User" },
		invoice: { type: Schema.Types.ObjectId, ref: "Invoice" },
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

const sectionSchema = new Schema(
	{
		name: String,
		topic: String,
		garants: [garantSchema],
		coordinators: [coordinatorSchema],
		speakers: [speakerSchema],
	},
	{ timestamps: true }
);

const conferenceSchema = new Schema(
	{
		host: { type: Schema.Types.ObjectId, ref: "Host" },
		name: String,
		start: Date,
		end: Date,
		regStart: Date,
		regEnd: Date,
		ticketPrice: Number,
		venue: {
			name: String,
			address,
		},
		sections: [sectionSchema],
		attendees: [attendeeSchema],
	},
	{ timestamps: true }
);

module.exports = model("Conference", conferenceSchema);
