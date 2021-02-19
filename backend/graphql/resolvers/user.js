const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { validateRegister, validateLogin } = require("../../util/validation");

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
		async deleteUser(_, { userId }, context) {
			try {
				const user = await User.findOne({ _id: userId });
				if (user) {
					await user.remove();
					return "User has been deleted";
				} else {
					throw new Error("User not found");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		async updateUser(_, { userId, userInput, billingInput }, context) {
			try {
				const { valid, errors } = validateRegister({
					...userInput,
					...billingInput,
				});
				if (!valid) {
					throw new UserInputError("Errors", { errors });
				}

				const password = await bcrypt.hash(userInput.password, 12);

				//const user = await User.findOne({ _id: userId });
				const update = {
					titleBefore: userInput.titleBefore,
					firstName: userInput.firstName,
					lastName: userInput.lastName,
					titleAfter: userInput.titleAfter,
					email: userInput.email,
					telephone: userInput.telephone,
					password,
					organisation: userInput.organisation,
					role: userInput.role,
					"billing.name": billingInput.name,
					"billing.DIC": billingInput.DIC,
					"billing.ICO": billingInput.ICO,
					"billing.address.street": billingInput.street,
					"billing.address.city": billingInput.city,
					"billing.address.postalCode": billingInput.postalCode,
					"billing.address.country": billingInput.country,
				};
				const user = await User.findOneAndUpdate({ _id: userId }, update, {
					new: true,
				});

				return user;
			} catch (err) {
				throw new Error(err);
			}
		},
		async register(parent, { registerInput, billingInput }, context, info) {
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
				"billing.name": billingInput.name,
				"billing.DIC": billingInput.DIC,
				"billing.ICO": billingInput.ICO,
				"billing.address.street": billingInput.street,
				"billing.address.city": billingInput.city,
				"billing.address.postalCode": billingInput.postalCode,
				"billing.address.country": billingInput.country,
				role: users === 0 ? "ADMIN" : registerInput.role,
			});

			const res = await user.save();

			const token = generateToken(res);

			return { id: res._id, ...res._doc, token };
		},
		async login(_, { email, password }, context) {
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
