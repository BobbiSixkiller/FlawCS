const { UserInputError } = require("apollo-server-express");

const Host = require("../../models/Host");
const { validateHost } = require("../../util/validation");

module.exports = {
	Query: {
		async getHosts() {
			try {
				const hosts = await Host.find().sort({ updatedAt: -1 });
				return hosts;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getHost(_parent, { hostId }, _context, _info) {
			const host = await Host.findOne({ _id: hostId });
			if (host) {
				return host;
			} else {
				throw new Error("Host not found.");
			}
		},
	},
	Mutation: {
		async createHost(_, { hostInput }) {
			const { errors, valid } = validateHost(hostInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const hostExists = await Host.findOne({ name: hostInput.name });
			if (hostExists) {
				throw new UserInputError("Host exists", {
					errors: { name: "Host with the submitted name already exists!" },
				});
			}

			const host = new Host({
				name: hostInput.name,
				"address.street": hostInput.address.street,
				"address.city": hostInput.address.city,
				"address.postal": hostInput.address.postal,
				"address.country": hostInput.address.country,
				ICO: hostInput.ICO,
				ICDPH: hostInput.ICDPH,
				DIC: hostInput.DIC,
				IBAN: hostInput.IBAN,
				SWIFT: hostInput.SWIFT,
				signatureUrl: hostInput.signatureUrl,
				logoUrl: hostInput.signatureUrl,
			});
			const res = await host.save();

			return res;
		},
		async updateHost(_, { hostId, hostInput }) {
			const { errors, valid } = validateHost(hostInput);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const hostExists = await Host.findOne({ name: hostInput.name });
			if (hostExists) {
				throw new UserInputError("Host exists", {
					errors: { name: "Host with the submitted name already exists!" },
				});
			}

			const update = {
				name: hostInput.name,
				"address.street": hostInput.address.street,
				"address.city": hostInput.address.city,
				"address.postal": hostInput.address.postal,
				"address.country": hostInput.address.country,
				ICO: hostInput.ICO,
				ICDPH: hostInput.ICDPH,
				DIC: hostInput.DIC,
				IBAN: hostInput.IBAN,
				SWIFT: hostInput.SWIFT,
				signatureUrl: hostInput.signatureUrl,
				logoUrl: hostInput.signatureUrl,
			};
			const host = await Host.findOneAndUpdate({ _id: hostId }, update, {
				new: true,
			});

			if (host) {
				return host;
			} else {
				throw new UserInputError("Host not found");
			}
		},
		async deleteHost(_, { hostId }) {
			const host = await Host.findOne({ _id: hostId });
			if (host) {
				await host.remove();
				return "Host has been deleted";
			} else {
				throw new UserInputError("Host not found");
			}
		},
	},
};
