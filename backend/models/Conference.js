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
		sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
		attendees: [attendeeSchema],
	},
	{ timestamps: true }
);

module.exports = model("Conference", conferenceSchema);
