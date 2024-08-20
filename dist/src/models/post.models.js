"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = exports.imageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.imageSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
}, { _id: false });
const postSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
        minLength: [10, "content must be at least of 10 characters"],
    },
    image: {
        type: exports.imageSchema,
        required: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });
exports.postModel = mongoose_1.default.model("post", postSchema);
