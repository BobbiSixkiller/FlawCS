const { model, Schema } = require("mongoose");
const { address } = require("./utilSchemas");

const userSchema = new Schema(
	{
		firstName: String,
		lastName: String,
		email: String,
		password: String,
		telephone: String,
		organisation: String,
		titleBefore: String,
		titleAfter: String,
		role: {
			type: String,
			enum: ["BASIC", "SUPERVISOR", "ADMIN"],
			default: "BASIC",
		},
		billing: {
			name: String,
			ICO: String,
			DIC: String,
			ICDPH: String,
			address,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("conferences", {
	ref: "Conference",
	localField: "_id",
	foreignField: "attendees.userId",
	justOne: false,
});

userSchema.virtual("submissions", {
	ref: "Submission",
	localField: "_id",
	foreignField: "authors",
	justOne: false,
});

userSchema.virtual("invoices", {
	ref: "Invoice",
	localField: "_id",
	foreignField: "userId",
	justOne: false,
});

module.exports = model("User", userSchema);
