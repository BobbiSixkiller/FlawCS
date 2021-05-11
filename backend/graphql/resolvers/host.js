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
		async createHost(
			_,
			{ hostInput: { name, billing, signatureUrl, logoUrl } }
		) {
			// const { errors, valid } = validateHost(hostInput);
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }

			const hostExists = await Host.findOne({ name });
			if (hostExists) {
				throw new UserInputError("Host exists", {
					errors: { name: "Host with the submitted name already exists." },
				});
			}

			const host = new Host({ name, billing, signatureUrl, logoUrl });
			await host.save();

			return {
				message: `Host ${host.name} has been created.`,
				host,
			};
		},
		async updateHost(
			_,
			{ hostId, hostInput: { name, billing, signatureUrl, logoUrl } }
		) {
			// const { errors, valid } = validateHost(hostInput);
			// if (!valid) {
			// 	throw new UserInputError("Errors", { errors });
			// }

			const host = await Host.findOne({ _id: hostId });
			if (!host) {
				throw new UserInputError("Host not found!");
			}

			host.name = name;
			host.billing = billing;
			host.signatureUrl = signatureUrl;
			host.logoUrl = logoUrl;

			await host.save();

			return {
				message: `Host ${host.name} has been updated.`,
				host,
			};
		},
		async deleteHost(_, { hostId }) {
			const host = await Host.findOne({ _id: hostId });
			if (!host) {
				throw new UserInputError("Host not found");
			}

			await host.remove();

			return {
				message: `Host ${host.name} has been deleted.`,
				host,
			};
		},
	},
};
