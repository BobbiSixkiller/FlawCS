const { model, Schema } = require("mongoose");
const location = require("./utilSchemas/location");
//test importu utility schemy
const locationSchema = new Schema(
	{
		name: String,
		address: {
			street: String,
			city: String,
			postal: String,
			country: String,
		},
	},
	{ timestamps: true }
);

const hostSchema = new Schema(
	{
		location: { locationSchema },
		ICO: String,
		DIC: String,
		IBAN: String,
		SWIFT: String,
		stampUrl: String,
	},
	{ timestamps: true }
);

const attendeeSchema = new Schema(
	{
		name: String,
		attendee: { type: Schema.Types.ObjectId, ref: "User" },
		invoice: { type: Schema.Types.ObjectId, ref: "Invoice" },
	},
	{
		timestamps: true,
	}
);

const speakerSchema = new Schema(
	{
		name: String,
		speaker: { type: Schema.Types.ObjectId, ref: "User" },
		submission: {
			name: String,
			abstract: String,
			keywords: String,
			url: String,
			reviewed: {
				type: Boolean,
				default: false,
			},
		},
		accepted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
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
		title: String,
		garants: [garantSchema],
		coordinators: [coordinatorSchema],
		speakers: [speakerSchema],
	},
	{
		timestamps: true,
	}
);

const conferenceSchema = new Schema(
	{
		name: String,
		start: Date,
		end: Date,
		regStart: Date,
		regEnd: Date,
		ticketPrice: Number,
		//location: { locationSchema },
		//host: { hostSchema },
		location: { location },
		host: { type: Schema.Types.ObjectId, ref: "Host" },
		sections: [sectionSchema],
		attendees: [attendeeSchema],
	},
	{
		timestamps: true,
	}
);

module.exports = model("Conference", conferenceSchema);
