const { Schema, model } = require("mongoose");

const submissionSchema = new Schema(
	{
		name: String,
		abstract: String,
		keywords: [{ type: String }],
		url: String,
		authors: [{ type: Schema.Types.ObjectId, ref: "User" }],
		accepted: {
			type: Boolean,
			default: false,
		},
		conferenceId: { type: Schema.Types.ObjectId, ref: "Conference" },
	},
	{ timestamps: true }
);
//needs refactor
submissionSchema.pre("remove", async function () {
	const submission = this;
	await submission
		.model("Section")
		.updateMany(
			{ "speakers.submissionId": submission._id },
			{ $pull: { speakers: { submissionId: submission._id } } }
		);
});

module.exports = model("Submission", submissionSchema);
