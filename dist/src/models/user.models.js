"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const post_models_1 = require("./post.models");
const getEnvironmentVar_1 = require("../utils/getEnvironmentVar");
const userSchema = new mongoose_1.default.Schema({
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
    image: post_models_1.imageSchema,
    password: {
        type: String,
        required: true,
        minLength: [8, "password must be at least 8 characters"],
    },
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcryptjs_1.default.hash(this.password, 10);
        }
        return next();
    });
});
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
userSchema.methods.generateToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, email: this.email }, (0, getEnvironmentVar_1.getEnvironmentVar)("JWT_SECRET_KEY"), {
        expiresIn: (0, getEnvironmentVar_1.getEnvironmentVar)("JWT_EXPIRY"),
    });
};
exports.userModel = mongoose_1.default.model("user", userSchema);
