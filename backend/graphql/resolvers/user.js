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
				throw new UserInputError("User not found.");
			}
		},
	},
	Mutation: {
		async deleteUser(_, { userId }) {
			const user = await User.findOne({ _id: userId });
			if (user) {
				await user.remove();
				return "User has been deleted.";
			} else {
				throw new UserInputError("User not found.");
			}
		},
		async updateUser(
			_,
			{ userId, role, userInput, addressInput, billingInput }
		) {
			const { valid, errors } = validateRegister({
				...userInput,
				...addressInput,
				...billingInput,
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

			const password = await bcrypt.hash(userInput.password, 12);

			const update = {
				titleBefore: registerInput.titleBefore,
				firstName: registerInput.firstName,
				lastName: registerInput.lastName,
				titleAfter: registerInput.titleAfter,
				email: registerInput.email,
				telephone: registerInput.telephone,
				password,
				organisation: registerInput.organisation,
				address: addressInput,
				billing: billingInput,
				role,
			};
			const user = await User.findOneAndUpdate({ _id: userId }, update, {
				new: true,
			});

			if (user) {
				return user;
			} else {
				throw new UserInputError("User not found.");
			}
		},
		async register(_, { registerInput, addressInput, billingInput }) {
			console.log(billingInput);
			const { valid, errors } = validateRegister({
				...registerInput,
				...addressInput,
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
				address: addressInput,
				billing: billingInput,
				role: users === 0 ? "ADMIN" : "BASIC",
			});

			const res = await user.save();

			const token = generateToken(res);

			return { id: res._id, ...res._doc, token };
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

			return { id: user._id, ...user._doc, token };
		},
	},
};
