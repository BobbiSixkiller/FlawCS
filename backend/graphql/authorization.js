const { and, or, rule, shield } = require("graphql-shield");
const checkAuth = require("../util/checkAuth");

function checkRole(user, role) {
	if (user) {
		return user.role === role;
	}
	return false;
}
