const Conference = require("../../models/Conference");

module.exports = {
	Query: {
		async getConferences() {
			try {
				const conferences = await Conference.find().sort({ updatedAt: -1 });
				return conferences;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getConference(parent, { conferenceId }, context, info) {
			try {
				const conference = await Conference.findOne({ _id: conferenceId });
				if (conference) {
					return conference;
				} else {
					throw new Error("Conference not found.");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async createConference() {},
		async updateConference() {},
		async deleteConference() {},
	},
};
