const { and, or, rule, shield, allow } = require("graphql-shield");
const checkAuth = require("../util/checkAuth");
const Conference = require("../models/Conference");

function checkRole(user, role) {
	if (user) {
		return user.role === role;
	}
	return false;
}

const isAuthenticated = rule()((parent, args, context) => {
	const user = checkAuth(context);
	return context.user !== null;
});

const isAdmin = rule()((parent, args, context) => {
	const user = checkAuth(context);
	return checkRole(user, "ADMIN");
});

const isSupervisor = rule()((parent, args, context) => {
	const user = checkAuth(context);
	return checkRole(user, "SUPERVISOR");
});

const isGarant = rule()(async (parent, args, context) => {
	const user = checkAuth(context);
	const garant = await Conference.findOne({
		"sections.garants.garant": user._id,
	});
	return garant !== null;
});

module.exports = shield(
	{
		Query: {
			getUsers: and(isAuthenticated, or(isAdmin, isSupervisor)),
		},
	},
	{ allowExternalErrors: true }
);
