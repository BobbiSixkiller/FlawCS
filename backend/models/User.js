const { model, Schema } = require("mongoose");

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
		billing: {
			name: String,
			address: {
				street: String,
				city: String,
				postalCode: String,
				country: String,
			},
			ICO: String,
			DIC: String,
		},
		role: {
			type: String,
			enum: ["BASIC", "SUPERVISOR", "ADMIN"],
			default: "BASIC",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model("User", userSchema);
