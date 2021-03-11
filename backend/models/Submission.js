const { Schema, model } = require("mongoose");

const submissionSchema = new Schema(
	{
		name: String,
		abstract: String,
		keywords: [{ keyword: String }],
		url: String,
		user: { type: Schema.Types.ObjectId, ref: "User" },
		conference: { type: Schema.Types.ObjectId, ref: "Conference" },
	},
	{ timestamps: true }
);

submissionSchema.pre("remove", async function () {
	const submission = this;
	await submission
		.model("Conference")
		.updateMany(
			{ "sections.speakers.submission": submission._id },
			{ $pull: { "sections.$.speakers": { submission: submission._id } } }
		);
});

module.exports = model("Submission", submissionSchema);
