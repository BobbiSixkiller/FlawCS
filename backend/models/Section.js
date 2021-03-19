const { Schema, model } = require("mongoose");

const garantSchema = new Schema(
	{
		name: String,
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const coordinatorSchema = new Schema(
	{
		name: String,
		userId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const submissionSchema = new Schema(
	{
		name: String,
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
		name: String,
		topic: String,
		start: Date,
		end: Date,
		languages: [{ type: String }],
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
