const { model, Schema } = require("mongoose");
const { billing } = require("./utilSchemas");

const hostSchema = new Schema(
	{
		billing,
		signatureUrl: String,
		logoUrl: String,
	},
	{ timestamps: true }
);

hostSchema.virtual("conferences", {
	ref: "Host",
	localField: "_id",
	foreignField: "host",
	justOne: false,
});

module.exports = model("Host", hostSchema);
