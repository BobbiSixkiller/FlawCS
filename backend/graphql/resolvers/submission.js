const { UserInputError } = require("apollo-server-express");

const Submission = require("../../models/Submission");
const { validateSubmission } = require("../../util/validation");

module.exports = {
	Query: {
		//development resolver, might not be needed in production
		async getSubmissions() {
			try {
				const submissions = await Submission.find()
					.populate("authors")
					.sort({ updatedAt: -1 });
				return submissions;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getSubmission(parent, { submissionId }) {
			const submission = await Submission.findOne({
				_id: submissionId,
			}).populate("authors");
			if (submission) {
				return submission;
			} else {
				throw new UserInputError("Submission not found.");
			}
		},
	},
	Mutation: {
		async updateSubmission(
			parent,
			{ submissionId, submissionInput, authors, accepted }
		) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const submission = await Submission.findOne({ _id: submissionId });
			if (!submission) {
				throw new UserInputError("Submission not found.");
			}
			submission.name = submissionInput.name;
			submission.abstract = submissionInput.abstract;
			submission.keywords = submissionInput.keywords;
			submission.url = submissionInput.url;
			submission.accepted = accepted;
			submission.authors = authors;

			const res = await submission.save();

			return res;
		},
		async deleteSubmission(parent, { submissionId }) {
			const submission = await Submission.findOne({ _id: submissionId });
			if (!submission) {
				throw new UserInputError("Submission not found.");
			}
			await submission.remove();
			return "Submission has been deleted";
		},
	},
};
