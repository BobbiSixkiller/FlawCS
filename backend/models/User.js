const { model, Schema } = require("mongoose");
const { billing } = require("./utilSchemas");

const userSchema = new Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    telephone: { type: String, trim: true },
    organisation: { type: String, trim: true },
    titleBefore: { type: String, trim: true },
    titleAfter: { type: String, trim: true },
    role: {
      type: String,
      enum: ["BASIC", "SUPERVISOR", "ADMIN"],
      default: "BASIC",
      //required: true,
    },
    billing,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  if (this.titleBefore && this.titleAfter) {
    return;
  }
  if (this.titleBefore) {
    return `${this.titleBefore} ${this.firstName} ${this.lastName}`;
  }
  if (this.titleAfter) {
    return `${this.firstName} ${this.lastName}, ${this.titleAfter}`;
  }
  return `${this.firstName} ${this.lastName}`;
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
