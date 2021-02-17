const { and, or, rule, shield, allow } = require("graphql-shield");
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

const isAdmin = rule({ cache: "contextual" })((parent, args, context) => {
	return checkRole(context.user, "ADMIN");
});

const isSupervisor = rule({ cache: "contextual" })((parent, args, context) => {
	return checkRole(context.user, "SUPERVISOR");
});

const isGarant = rule()(async (parent, args, context) => {
	const garant = await Conference.findOne({
		"sections.garants.garant": context.user.id,
	});
	return garant !== null;
});

module.exports = shield(
	{
		Query: {
			getUsers: and(isAuthenticated, or(isAdmin, isSupervisor)),
			getUser: and(isAuthenticated, or(isAdmin, isSupervisor)),
		},
	},
	{ allowExternalErrors: true }
);
