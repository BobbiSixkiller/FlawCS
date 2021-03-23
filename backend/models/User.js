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
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return this.titleAfter.length === 0
    ? `${this.titleBefore} ${this.firstName} ${this.lastName}`
    : `${this.titleBefore} ${this.firstName} ${this.lastName}, ${this.titleAfter}`;
});

userSchema.virtual("isFlaw").get(function () {
  return this.email.slice(this.email.indexOf("@") + 1) === "flaw.uniba.sk";
});

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
