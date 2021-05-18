const { UserInputError } = require("apollo-server-express");
const { model, Schema } = require("mongoose");

const { billing } = require("./utilSchemas");

const hostSchema = new Schema(
	{
		name: { type: String, trim: true },
		billing,
		signatureUrl: String,
		logoUrl: String,
	},
	{ timestamps: true }
);

hostSchema.pre("save", async function () {
	if (this.isModified("name")) {
		const hostExists = await this.model("Host").findOne({ name: this.name });
		if (hostExists) {
			throw new UserInputError("Host exists", {
				errors: { name: "Host with the submitted name already exists." },
			});
		}
	}
});

hostSchema.virtual("conferences", {
	ref: "Host",
	localField: "_id",
	foreignField: "host",
	justOne: false,
});

module.exports = model("Host", hostSchema);
