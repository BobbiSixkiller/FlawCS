const { Schema, model } = require("mongoose");

const submissionSchema = new Schema(
	{
		name: String,
		abstract: String,
		keywords: [{ type: String }],
		url: String,
		authors: [{ type: Schema.Types.ObjectId, ref: "User" }],
		conferenceId: { type: Schema.Types.ObjectId, ref: "Conference" },
		sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
		accepted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

submissionSchema.pre("remove", async function () {
	await this.model("Section").updateMany(
		{ "submissions.submissionId": this._id },
		{ $pull: { submissions: { submissionId: this._id } } }
	);
});

submissionSchema.pre("save", async function () {
	if (this.isModified()) {
		await this.model("Section").updateOne(
			{ "submissions.submissionId": this._id },
			{
				"submissions.$.name": this.name,
				"submissions.$.accepted": this.accepted,
				"submissions.$.updatedAt": this.updatedAt,
			}
		);
		await this.model("Conference").updateOne(
			{ "sections.sectionId": this.sectionId },
			{ "sections.$.updatedAt": this.updatedAt }
		);
	}
});

submissionSchema.post("save", async function (submission) {
	await submission.populate("authors").execPopulate();
});

module.exports = model("Submission", submissionSchema);
