const { UserInputError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { validateRegister, validateLogin } = require("../../util/validation");

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			name: user.firstName + " " + user.lastName,
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
		async getUser(_parent, { userId }, _context, _info) {
			const user = await User.findOne({ _id: userId }).populate("submissions");
			if (user) {
				return user;
			} else {
				throw new UserInputError("User not found!");
			}
		},
	},
	Mutation: {
		async deleteUser(_, { userId }) {
			const user = await User.findOne({ _id: userId });
			if (!user) {
				throw new UserInputError("User not found!");
			}
			await user.remove();

			return { message: "User has been deleted.", user };
		},
		async updateUser(_, { userId, role, userInput, billingInput }) {
			const { valid, errors } = validateRegister({
				...userInput,
				...billingInput,
				role,
			});
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const emailExists = await User.findOne({ email: userInput.email });
			if (emailExists && emailExists._id != userId) {
				throw new UserInputError("Email taken!", {
					errors: {
						email: "Submitted email address is already taken!",
					},
				});
			}
			const user = await User.findOne({ _id: userId });

			const password = await bcrypt.hash(userInput.password, 12);

			user.role = role;
			user.titleBefore = userInput.titleBefore;
			user.firstName = userInput.firstName;
			user.lastName = userInput.lastName;
			user.titleAfter = userInput.titleAfter;
			user.email = userInput.email;
			user.password = password;
			user.organisation = userInput.organisation;
			user.telephone = userInput.telephone;
			user.billing = billingInput;

			await user.save();

			return { message: "User has been updated.", user };
		},
		async register(_, { registerInput, billingInput }) {
			const { valid, errors } = validateRegister({
				...registerInput,
				...billingInput,
			});
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const emailExists = await User.findOne({ email: registerInput.email });
			if (emailExists) {
				throw new UserInputError("Email taken!", {
					errors: {
						email: "Submitted email address is already taken",
					},
				});
			}

			const password = await bcrypt.hash(registerInput.password, 12);

			const users = await User.countDocuments();

			const user = new User({
				titleBefore: registerInput.titleBefore,
				firstName: registerInput.firstName,
				lastName: registerInput.lastName,
				titleAfter: registerInput.titleAfter,
				email: registerInput.email,
				telephone: registerInput.telephone,
				password,
				organisation: registerInput.organisation,
				billing: billingInput,
				role: users === 0 ? "ADMIN" : "BASIC",
			});

			const res = await user.save();
			const token = generateToken(res);

			return {
				message: "New user successfully registered.",
				user: { id: res._id, ...res._doc, token },
			};
		},
		async login(_, { email, password }) {
			const { errors, valid } = validateLogin(email, password);
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

			return {
				message: "Welcome!",
				user: { id: user._id, ...user._doc, token },
			};
		},
	},
};
