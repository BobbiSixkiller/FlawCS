const { model, Schema } = require("mongoose");
const address = require("./utilSchemas/address");

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
			address: address,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("conferences", {
	ref: "Conference",
	localField: "_id",
	foreignField: "attendees.attendee",
	justOne: false,
});

userSchema.virtual("invoices", {
	ref: "Invoice",
	localField: "_id",
	foreignField: "user",
	justOne: false,
});

module.exports = model("User", userSchema);
