const { UserInputError } = require("apollo-server-express");

const Submission = require("../../models/Submission");
const { validateSubmission } = require("../../util/validation");

module.exports = {
	Query: {
		async getSubmissions() {
			try {
				const submissions = await Submission.find().sort({ updatedAt: -1 });
				return submissions;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getSubmission(parent, { submissionId }) {
			const submission = await Submission.findOne({ _id: submissionId });
			if (submission) {
				return submission;
			} else {
				throw new UserInputError("Submission not found.");
			}
		},
	},
	Mutation: {
		async updateSubmission(parent, { submissionId, submissionInput }) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const update = await Submission.findOneAndUpdate(
				{ _id: submissionId },
				submissionInput,
				{ new: true }
			);
			if (update) {
				return update;
			} else {
				throw new UserInputError("Submission not found.");
			}
		},
		async deleteSubmission(parent, { submissionId }) {
			const submission = await Submission.findOne({ _id: submissionId });
			if (submission) {
				await submission.remove();
				return "Submission has been deleted";
			} else {
				throw new UserInputError("Submission not found.");
			}
		},
	},
};
