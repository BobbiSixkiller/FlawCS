const { UserInputError } = require("apollo-server-express");

const Conference = require("../../models/Conference");
const Section = require("../../models/Section");
const Submission = require("../../models/Submission");
const {
	validateSection,
	validateStaff,
	validateSubmission,
} = require("../../util/validation");

module.exports = {
	Query: {
		//development resolver, might not be needed in production
		async getConferenceSections(parent, { conferenceId }) {
			const sections = await Section.find({ conferenceId }).sort({
				createdAt: -1,
			});
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
			const { errors, valid } = validateSection(sectionInput);
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

			const section = new Section({
				...sectionInput,
				conferenceId,
			});
			conference.sections.push({ name: section.name, sectionId: section._id });

			await Promise.all([section.save(), conference.save()]);

			return {
				message: `Section ${section.name} of ${conference.name} conference has been created.`,
				conference,
				section,
			};
		},
		async updateSection(parent, { sectionId, sectionInput }) {
			const { errors, valid } = validateSection(sectionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}
			const conference = await Conference.findOne({
				_id: section.conferenceId,
			});
			const sectionExists = conference.sections.find(
				(section) =>
					section.name == sectionInput.name && section.sectionId != sectionId
			);
			if (sectionExists) {
				throw new UserInputError("Section exists!", {
					errors: { name: "Section with submitted name already exists." },
				});
			}

			section.name = sectionInput.name;
			section.topic = sectionInput.topic;
			section.start = sectionInput.start;
			section.end = sectionInput.end;
			section.languages = sectionInput.languages;

			await section.save();

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
			const { errors, valid } = validateStaff(name, userId);
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
			await section.save();

			return {
				message: `New garant has been added to ${section.name} section.`,
				section,
			};
		},
		async removeGarant(parent, { sectionId, garantId }) {
			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}

			section.garants.pull({ _id: garantId });
			await section.save();

			return {
				message: `Garant has been removed from ${section.name} section.`,
				section,
			};
		},
		async addCoordinator(parent, { sectionId, userId, name }) {
			const { errors, valid } = validateStaff(name, userId);
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
			await section.save();

			return {
				message: `New coordinator has been added to ${section.name} section.`,
				section,
			};
		},
		async removeCoordinator(parent, { sectionId, coordinatorId }) {
			const section = await Section.findOne({ _id: sectionId });
			if (!section) {
				throw new UserInputError("Section not found.");
			}

			section.garants.pull({ _id: coordinatorId });
			await section.save();

			return {
				message: `Coordinator has been removed from ${section.name} section.`,
				section,
			};
		},
		async addSubmission(parent, { conferenceId, sectionId, submissionInput }) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			const submission = new Submission({
				...submissionInput,
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
				message: `Submission has been added to ${section.name} section.`,
				submission,
				section,
			};
		},
	},
};
