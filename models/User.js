import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"; // package to hash password
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail, // validator fn from validator package
      message: "Please provide a valid email address",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
    select: false, // don't send password in response (does not work with User.create())
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "my city",
  },
});

// before we save document we going to run functionality (hashing password):
UserSchema.pre("save", async function () {
  // console.log(this.password)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // "this" points to instance created by UserSchema
});

UserSchema.methods.createJWT = function () {
  // console.log(this) // this points to the document (instance of UserSchema)
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
} // bcrypt compares password in the req against password in the db

export default mongoose.model("User", UserSchema);
