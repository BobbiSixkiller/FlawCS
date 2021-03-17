const { and, or, rule, shield } = require("graphql-shield");
const Conference = require("../models/Conference");

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

const isOwnUser = rule({ cache: "strict" })((parent, { userId }, { user }) => {
	return userId === user.id;
});

const isAdmin = rule({ cache: "contextual" })((parent, args, { user }) => {
	return checkRole(user, "ADMIN");
});

const isSupervisor = rule({ cache: "contextual" })((parent, args, { user }) => {
	return checkRole(user, "SUPERVISOR");
});

const isGarant = rule({ cache: "strict" })(
	async (parent, { sectionId }, { user }) => {
		const conference = await Conference.findOne({
			"sections.garants.garant": user.id,
		});
		const garant = conference.sections
			.id(sectionId)
			.garants.find((g) => g.garant == user.id);
		return garant !== null;
	}
);

module.exports = shield(
	{
		Query: {
			getUsers: and(isAuthenticated, or(isAdmin, isSupervisor)),
			getUser: and(isAuthenticated, or(isOwnUser, isAdmin, isSupervisor)),
		},
		Mutation: {
			deleteUser: and(isAuthenticated, isAdmin),
			updateUser: and(isAuthenticated, or(isOwnUser, isAdmin, isSupervisor)),
			createHost: and(isAuthenticated, or(isAdmin, isSupervisor)),
			updateHost: and(isAuthenticated, or(isAdmin, isSupervisor)),
			deleteHost: and(isAuthenticated, isAdmin),
		},
	},
	{ allowExternalErrors: true }
);
