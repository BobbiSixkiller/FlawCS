const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

module.exports = {
	Query: {
		async getUsers() {
			try {
				const users = await User.find();
				return users;
			} catch (err) {
				console.log(err);
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async register(
			parent,
			{
				registerInput: {
					firstName,
					lastName,
					titleBefore,
					titleAfter,
					email,
					telephone,
					password,
					confirmPassword,
					organisation,
				},
			},
			context,
			info
		) {
			try {
				const emailExists = await User.findOne({ email });
				if (emailExists) {
					throw new UserInputError("Email is already taken!", {
						errors: {
							email: "Submitted email address is already taken",
						},
					});
				}

				password = await bcrypt.hash(password, 12);
				confirmPassword = await bcrypt.hash(confirmPassword, 12);
				if (password !== confirmPassword) {
					throw new UserInputError("Passwords do not match!");
				}

				const user = new User({
					titleBefore,
					firstName,
					lastName,
					titleAfter,
					email,
					telephone,
					password,
					organisation,
				});

				const res = await user.save();

				const token = jwt.sign(
					{ id: res._id, email: res.email },
					process.env.SECRET,
					{ expiresIn: "1h" }
				);

				return { id: res._id, ...res._doc, token };
			} catch (err) {
				console.log(err);
				throw new Error(err);
			}
		},
	},
};
