const { UserInputError } = require("apollo-server-express");

const Section = require("../../models/Section");
const Conference = require("../../models/Conference");
const { validateSection, validateGarant } = require("../../util/validation");

module.exports = {
	Query: {
		async getSections(parent, { conferenceId }) {
			try {
				const sections = await Section.find().sort({ createdAt: -1 });
				return sections;
			} catch (err) {
				throw new Error(err);
			}
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
		async createSection(parent, { conferenceId, name, topic }) {
			const { errors, valid } = validateSection(name, topic);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const conference = await Conference.findOne({ _id: conferenceId });
			if (!conference) {
				throw new UserInputError("Conference not found.");
			}
			const section = new Section({ name, topic });
			conference.sections.push({ name, sectionId: section._id });

			await Promise.all([section.save(), conference.save()]);

			return conference;
		},
		async updateSection(
			parent,
			{ conferenceId, sectionId, name, topic, start, end }
		) {
			const { errors, valid } = validateSection(name, topic);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const [conference, section] = await Promise.all([
				Conference.findOne({ _id: conferenceId }),
				Section.findOne({ _id: sectionId }),
			]);
			if (!conference || !section) {
				throw new UserInputError("Conference or section not found.");
			}

			const confSec = conference.sections.find((s) => s.sectionId == sectionId);
			confSec.name = name;

			section.name = name;
			section.topic = topic;
			section.start = start;
			section.end = end;

			const res = await Promise.all([conference.save(), section.save()]);

			return res[1];
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
				throw new UserInputError("Garant is already submitted.");
			}

			section.garants.push({ name, userId });
			const res = await section.save();

			return res;
		},
		async deleteGarant(parent, { conferenceId, sectionId, garantId }) {},
		async addCoordinator(parent, { sectionId, name, coordinator }) {
			const { errors, valid } = validateGarant(name, coordinator);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
		},
		async deleteCoordinator(parent, { sectionId, coordinatorId }) {},
		async addSubmission(
			parent,
			{ sectionId, submissionInput },
			{ user: { id, name } }
		) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
		},
		async addSpeaker(parent, { sectionId, userId, name, submissionInput }) {
			const { errors, valid } = validateSubmission(submissionInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
		},
		async deleteSpeaker(parent, { sectionId, speakerId }) {},
		async approveSpeaker(parent, { sectionId, speakerId }) {},
	},
};
