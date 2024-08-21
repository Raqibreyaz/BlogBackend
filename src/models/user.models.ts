import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { imageSchema } from "./post.models.js";
import { userInterface } from "../interfaces/user.interfaces.js";
import { ApiError } from "../utils/apiError.js";

const userSchema: mongoose.Schema<userInterface> = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    // url & public_id
    image: imageSchema,
    password: {
      type: String,
      required: true,
      minLength: [8, "password must be at least 8 characters"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  return next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  const jwtSecret = process.env.JWT_SECRET_KEY;
  const jwtExpiry = process.env.JWT_EXPIRY;

  if (!jwtSecret || !jwtExpiry) {
    console.log("jwt secret or expiry missing", jwtSecret, jwtExpiry);
    throw new ApiError(400, "environment variable not setted");
  }

  return jwt.sign({ id: this._id, email: this.email }, jwtSecret, {
    expiresIn: jwtExpiry,
  });
};

export const userModel = mongoose.model<userInterface>("user", userSchema);
