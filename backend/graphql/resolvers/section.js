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
			// const { errors, valid } = validateSection({ ...sectionInput });
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }

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

			return {
				message: `Section ${section.name} of ${conference.name} conference has been created.`,
				conference,
				section,
			};
		},
		async updateSection(parent, { sectionId, sectionInput }) {
			// const { errors, valid } = validateSection({ ...sectionInput });
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }
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

			return {
				message: `Section ${section.name} has been updated.`,
				section,
			};
		},
		async deleteSection(parent, { sectionId }) {
			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}

			await section.remove();

			return {
				message: `Section ${section.name} has been deleted.`,
				section,
			};
		},
		async addGarant(parent, { sectionId, userId, name }) {
			// const { errors, valid } = validateGarant(name, userId);
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }
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
			await section.save();

			return {
				message: `New garant has been added to ${secton.name} section.`,
				section,
			};
		},
		async removeGarant(parent, { sectionId, userId }) {
			const section = await Section.findOneAndUpdate(
				{ _id: sectionId },
				{ $pull: { garants: { userId } } },
				{ new: true }
			);
			if (!section) {
				throw new UserInputError("Section not found.");
			}
			return {
				message: `Garant has been removed from ${secton.name} section.`,
				section,
			};
		},
		async addCoordinator(parent, { sectionId, userId, name }) {
			// const { errors, valid } = validateGarant(name, userId);
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }
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
			await section.save();

			return {
				message: `New coordinator has been added to ${secton.name} section.`,
				section,
			};
		},
		async removeCoordinator(parent, { sectionId, userId }) {
			const section = await Section.findOneAndUpdate(
				{ _id: sectionId },
				{ $pull: { coordinators: { userId } } },
				{ new: true }
			);
			if (!section) {
				throw new UserInputError("Section not found.");
			}
			return {
				message: `Coordinator has been removed from ${section.name} section.`,
				section,
			};
		},
		async addSubmission(
			parent,
			{ conferenceId, sectionId, authors, submissionInput }
		) {
			// const { errors, valid } = validateSubmission(submissionInput);
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }
			const submission = new Submission({
				...submissionInput,
				authors,
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
				throw new UserInputError("Submission exists", {
					errors: {
						name: "Section already contains a submission with provided name.",
					},
				});
			}

			section.submissions.push({
				name: submission.name,
				submissionId: submission._id,
			});

			await Promise.all([submission.save(), section.save()]);

			return {
				message: `Submission has been added to ${secton.name} section.`,
				submission,
				section,
			};
		},
	},
};
