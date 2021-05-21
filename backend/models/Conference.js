const { model, Schema } = require("mongoose");
const { address } = require("./utilSchemas");

const attendeeSchema = new Schema(
	{
		name: { type: String, trim: true },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
	},
	{ timestamps: true }
);

const sectionSchema = new Schema(
	{
		name: { type: String, trim: true },
		topic: { type: String, trim: true },
		languages: [{ type: String, trim: true }],
		sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
	},
	{ timestamps: true }
);

const conferenceSchema = new Schema(
	{
		host: { type: Schema.Types.ObjectId, ref: "Host" },
		name: { type: String, trim: true },
		regStart: Date,
		regEnd: Date,
		start: Date,
		end: Date,
		ticketPrice: Number,
		variableSymbol: Number,
		venue: {
			name: { type: String, trim: true },
			address,
		},
		sections: [sectionSchema],
		attendees: [attendeeSchema],
	},
	{ timestamps: true }
);

conferenceSchema.pre("remove", async function () {
	//const objectIds = this.sections.map((section) => section.sectionId);

	//await this.model("Section").deleteMany({ _id: { $in: objectIds } });
	await this.model("Section").deleteMany({ conferenceId: this._id });
	await this.model("Submission").deleteMany({ conferenceId: this._id });
	await this.model("Invoice").deleteMany({ conferenceId: this._id });
});

module.exports = model("Conference", conferenceSchema);
