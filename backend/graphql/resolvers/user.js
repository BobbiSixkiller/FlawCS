const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const checkAuth = require("../../util/checkAuth");
const User = require("../../models/User");
const {
	validateRegisterInput,
	validateLoginInput,
} = require("../../util/validation");

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			role: user.role,
		},
		process.env.SECRET,
		{
			expiresIn: "1h",
		}
	);
}

module.exports = {
	Query: {
		async getUsers() {
			try {
				const users = await User.find().sort({ updatedAt: -1 });
				return users;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getUser(_, { userId }, context) {
			try {
				const authorized = checkAuth(context);
				console.log(authorized);
				const user = await User.findOne({ _id: userId });
				if (user) {
					return user;
				} else {
					throw new Error("User not found");
				}
			} catch (err) {
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
			const { valid, errors } = validateRegisterInput(
				firstName,
				lastName,
				titleBefore,
				titleAfter,
				email,
				telephone,
				password,
				confirmPassword,
				organisation
			);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const emailExists = await User.findOne({ email });
			if (emailExists) {
				throw new UserInputError("Email taken!", {
					errors: {
						email: "Submitted email address is already taken",
					},
				});
			}

			password = await bcrypt.hash(password, 12);

			const users = await User.find();

			const user = new User({
				titleBefore,
				firstName,
				lastName,
				titleAfter,
				email,
				telephone,
				password,
				organisation,
				role: users.length === 0 ? "ADMIN" : "BASIC",
			});

			const res = await user.save();
			console.log(res);

			const token = generateToken(res);

			return { id: res._id, ...res._doc, token };
		},
		async login(_, { email, password }, context) {
			const { errors, valid } = validateLoginInput(email, password);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const user = await User.findOne({ email });
			if (!user) {
				errors.general = "Email or password is incorrect";
				throw new UserInputError("Wrong credentials", { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = "Email or password is incorrect";
				throw new UserInputError("Wrong credentials", { errors });
			}

			const token = generateToken(user);

			return { id: user._id, ...user._doc, token };
		},
		async deleteUser(_, { userID }, context) {},
	},
};
