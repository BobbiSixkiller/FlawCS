const { Schema, model } = require("mongoose");

const garantSchema = new Schema(
	{
		name: { type: String, trim: true },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const coordinatorSchema = new Schema(
	{
		name: { type: String, trim: true },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const submissionSchema = new Schema(
	{
		name: { type: String, trim: true },
		submissionId: { type: Schema.Types.ObjectId, ref: "Submission" },
		accepted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const sectionSchema = new Schema(
	{
		conferenceId: { type: Schema.Types.ObjectId, ref: "Conference" },
		name: { type: String, trim: true },
		topic: { type: String, trim: true },
		start: Date,
		end: Date,
		languages: [{ type: String, trim: true }],
		garants: [garantSchema],
		coordinators: [coordinatorSchema],
		submissions: [submissionSchema],
	},
	{ timestamps: true }
);

sectionSchema.pre("remove", async function () {
	await this.model("Conference").findOneAndUpdate(
		{ "sections.sectionId": this._id },
		{ $pull: { sections: { sectionId: this._id } } }
	);
	await this.model("Submission").deleteMany({ sectionId: this._id });
});

sectionSchema.pre("save", async function () {
	await this.model("Conference").findOneAndUpdate(
		{
			"sections.sectionId": this._id,
		},
		{
			"sections.$.name": this.name,
			"sections.$.topic": this.topic,
			"sections.$.updatedAt": this.updatedAt,
		}
	);
});

module.exports = model("Section", sectionSchema);
