const { and, or, rule, shield, allow } = require("graphql-shield");
const checkAuth = require("../util/checkAuth");
const Conference = require("../models/Conference");

const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

function checkRole(user, role) {
	if (user) {
		return user.role === role;
	}
	return false;
}

const isAuthenticated = rule()((parent, args, context) => {
	//const user = checkAuth(context);
	//return user !== null;
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, process.env.SECRET);
				return user !== null;
			} catch (err) {
				return new AuthenticationError("Token is invalid or expired!");
			}
		} else {
			return new Error("Authentication header must be 'Bearer [token]");
		}
	} else {
		return new Error("No authentication header provided!");
	}
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
