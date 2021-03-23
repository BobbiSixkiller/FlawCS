const { UserInputError } = require("apollo-server-express");

const Conference = require("../../models/Conference");
const Section = require("../../models/Section");
const Submission = require("../../models/Submission");
const {
	validateSection,
	validateGarant,
	validateSubmission,
} = require("../../util/validation");

module.exports = {
	Query: {
		//development resolver, might not be needed in production
		async getSections() {
			const sections = await Section.find().sort({ createdAt: -1 });
			return sections;
		},
		async getSection(parent, { sectionId }) {
			const section = await Section.findOne({ _id: sectionId });
			if (section) {
				return section;
			} else {
				throw new UserInputError("Section not found.");
			}
		},
	},
	Mutation: {
		async createSection(parent, { conferenceId, sectionInput }) {
			const { errors, valid } = validateSection({ ...sectionInput });
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (!conference) {
				throw new UserInputError("Conference not found.");
			}
			const sectionExists = conference.sections.find(
				(s) => s.name == sectionInput.name
			);
			if (sectionExists) {
				throw new UserInputError("Errors", {
					errors: { name: "Section with provided name already exists." },
				});
			}

			const section = new Section({ ...sectionInput });
			conference.sections.push({ name: section.name, sectionId: section._id });

			await Promise.all([section.save(), conference.save()]);

			return conference;
		},
		async updateSection(parent, { sectionId, sectionInput }) {
			const { errors, valid } = validateSection({ ...sectionInput });
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}

			section.name = sectionInput.name;
			section.topic = sectionInput.topic;
			section.start = sectionInput.start;
			section.end = sectionInput.end;
			section.languages = sectionInput.languages;

			const res = await section.save();

			return res;
		},
		async deleteSection(parent, { sectionId }) {
			const section = await Section.findOne({ _id: sectionId });
			if (section) {
				await section.remove();
				return "Section has been deleted.";
			} else {
				throw new UserInputError("Section not found.");
			}
		},
		async addGarant(parent, { sectionId, userId, name }) {
			const { errors, valid } = validateGarant(name, userId);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}
			const garantExists = section.garants.find((g) => g.userId == userId);
			if (garantExists) {
				throw new UserInputError("Garant exists", {
					errors: { name: "Garant is already submitted." },
				});
			}

			section.garants.push({ name, userId });
			const res = await section.save();

			return res;
		},
		async removeGarant(parent, { sectionId, userId }) {
			const update = await Section.findOneAndUpdate(
				{ _id: sectionId },
				{ $pull: { garants: { userId } } },
				{ new: true }
			);
			if (!update) {
				throw new UserInputError("Section not found.");
			}
			return update;
		},
		async addCoordinator(parent, { sectionId, userId, name }) {
			const { errors, valid } = validateGarant(name, userId);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}
			const coordinatorExists = section.coordinators.find(
				(c) => c.userId == userId
			);
			if (coordinatorExists) {
				throw new UserInputError("Coordinator exists", {
					errors: { name: "Coordinator is already submitted." },
				});
			}

			section.coordinators.push({ name, userId });
			const res = await section.save();

			return res;
		},
		async removeCoordinator(parent, { sectionId, userId }) {
			const update = await Section.findOneAndUpdate(
				{ _id: sectionId },
				{ $pull: { coordinators: { userId } } },
				{ new: true }
			);
			if (!update) {
				throw new UserInputError("Section not found.");
			}
			return update;
		},
		async addSubmission(
			parent,
			{ conferenceId, sectionId, authors, submissionInput },
			{ user }
		) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const submission = new Submission({
				...submissionInput,
				authors: authors ? authors : user.id,
				conferenceId,
				sectionId,
			});

			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}
			const submissionExists = section.submissions.find(
				(s) => s.name == submission.name
			);
			if (submissionExists) {
				throw new UserInputError(
					"Section already contains a submission with provided name."
				);
			}

			section.submissions.push({
				name: submission.name,
				submissionId: submission._id,
			});

			const res = await Promise.all([submission.save(), section.save()]);

			return res[1];
		},
	},
};
