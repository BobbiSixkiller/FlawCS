const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, process.env.SECRET);
				return user;
			} catch (err) {
				throw new AuthenticationError("Token is invalid or expired!");
			}
		} else {
			throw new Error("Authentication header must be 'Bearer [token]");
		}
	} else {
		throw new Error("No authentication header provided!");
	}
};
