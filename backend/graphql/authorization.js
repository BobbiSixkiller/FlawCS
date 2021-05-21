const { and, or, rule, shield } = require("graphql-shield");
const Submission = require("../models/Submission");

function checkRole(user, role) {
	if (user) {
		return user.role === role;
	}
	return false;
}

const isAuthenticated = rule({ cache: "contextual" })(
	(parent, args, context) => {
		return context.user !== null;
	}
);

const isAdmin = rule({ cache: "contextual" })((parent, args, { user }) => {
	return checkRole(user, "ADMIN");
});

const isSupervisor = rule({ cache: "contextual" })((parent, args, { user }) => {
	return checkRole(user, "SUPERVISOR");
});

const isOwnUser = rule({ cache: "strict" })((parent, { userId }, { user }) => {
	return userId === user.id;
});

const isOwnSubmission = rule({ cache: "strict" })(
	async (parent, { submissionId }, { user }) => {
		const submission = await Submission.findOne({ _id: submissionId });

		return submission.authors.some((author) => author == user.id);
	}
);

module.exports = shield(
	{
		Query: {
			//deny all other development queries when deploying to production
			//"*": deny,
			getUsers: and(isAuthenticated, or(isAdmin, isSupervisor)),
			getUser: and(isAuthenticated, or(isOwnUser, isAdmin, isSupervisor)),
			getConferenceInvoices: and(isAuthenticated, or(isAdmin, isSupervisor)),
			getInvoice: and(isAuthenticated, or(isAdmin, isSupervisor)),
			getSection: and(isAuthenticated, or(isAdmin, isSupervisor)),
			getSubmission: and(
				isAuthenticated,
				or(isOwnSubmission, isAdmin, isSupervisor)
			),
		},
		Mutation: {
			deleteUser: and(isAuthenticated, isAdmin),
			updateUser: and(isAuthenticated, or(isOwnUser, isAdmin, isSupervisor)),
			createHost: and(isAuthenticated, or(isAdmin, isSupervisor)),
			updateHost: and(isAuthenticated, or(isAdmin, isSupervisor)),
			deleteHost: and(isAuthenticated, isAdmin),
			createConference: and(isAuthenticated, or(isAdmin, isSupervisor)),
			updateConference: and(isAuthenticated, or(isAdmin, isSupervisor)),
			deleteConference: and(isAuthenticated, isAdmin),
			addAttendee: isAuthenticated,
			removeAttendee: and(isAuthenticated, isAdmin),
			updateInvoice: and(isAuthenticated, or(isAdmin, isSupervisor)),
			createSection: and(isAuthenticated, or(isAdmin, isSupervisor)),
			updateSection: and(isAuthenticated, or(isAdmin, isSupervisor)),
			deleteSection: and(isAuthenticated, isAdmin),
			addGarant: and(isAuthenticated, or(isAdmin, isSupervisor)),
			removeGarant: and(isAuthenticated, or(isAdmin, isSupervisor)),
			addCoordinator: and(isAuthenticated, or(isAdmin, isSupervisor)),
			removeCoordinator: and(isAuthenticated, or(isAdmin, isSupervisor)),
			addSubmission: isAuthenticated,
			updateSubmission: and(
				isAuthenticated,
				or(isOwnSubmission, isAdmin, isSupervisor)
			),
			deleteSubmission: and(isAuthenticated, isAdmin),
		},
		Conference: {
			attendees: and(isAuthenticated, or(isAdmin, isSupervisor)),
		},
	},
	{ allowExternalErrors: true }
);
