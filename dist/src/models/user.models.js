import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { imageSchema } from "./post.models.js";
import envs from "../utils/getEnvironmentVar.js";
const userSchema = new mongoose.Schema({
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
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, envs.JWT_SECRET_KEY, {
        expiresIn: envs.JWT_EXPIRY,
    });
};
export const userModel = mongoose.model("user", userSchema);
