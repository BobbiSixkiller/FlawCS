const { UserInputError } = require("apollo-server");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

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
		async uploadFile(parent, { file }) {
			const { createReadStream, filename, mimetime, encoding } = await file;

			const stream = createReadStream();
			path.dirname(require.main.filename);
			const pathName = path.join(process.cwd(), `/public/images/${filename}`);
			await stream.pipe(fs.createWriteStream(pathName));

			return { url: `${process.env.BASE_URL}/${filename}` };
		},
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
				stampUrl: hostInput.stampUrl,
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
				stampUrl: hostInput.stampUrl,
			};
			const host = await Host.findOneAndUpdate({ _id: hostId }, update, {
				new: true,
			});

			if (host) {
				return host;
			} else {
				throw new Error("Host not found");
			}
		},
		async deleteHost(_, { hostId }) {
			const host = await Host.findOne({ _id: hostId });
			if (host) {
				await host.remove();
				return "Host has been deleted";
			} else {
				throw new Error("Host not found");
			}
		},
	},
};
