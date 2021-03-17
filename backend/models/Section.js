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

//refactor podla doda
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
	const section = this;
	await section
		.model("Conference")
		.findOneAndUpdate(
			{ "sections.sectionId": section._id },
			{ $pull: { sections: { sectionId: section._id } } }
		);
});

module.exports = model("Section", sectionSchema);
