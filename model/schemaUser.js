const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { Sub } = require("../helpers/constants");

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 1,
      default: "Guest",
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/g;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    token: { type: String, default: null },
    subscription: {
      type: String,
      enum: [...Object.values(Sub)],
      default: Sub.STARTER,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = model("user", userSchema);

module.exports = User;