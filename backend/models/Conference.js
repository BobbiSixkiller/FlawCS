const { model, Schema } = require("mongoose");
const { address } = require("./utilSchemas");

const attendeeSchema = new Schema(
	{
		name: String,
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
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
		sections: [
			{
				name: String,
				sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
			},
		],
		attendees: [attendeeSchema],
	},
	{ timestamps: true }
);

conferenceSchema.pre("remove", async function () {
	const objectIds = this.sections.map((section) => section.sectionId);

	await this.model("Section").deleteMany({ _id: { $in: objectIds } });
});

module.exports = model("Conference", conferenceSchema);
