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
exports.deleteFromCloudinary = exports.uploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!filepath)
        return;
    try {
        let uploadResponse = yield cloudinary_1.v2.uploader.upload(filepath);
        fs_1.default.unlinkSync(filepath);
        return uploadResponse;
    }
    catch (error) {
        if (error instanceof Error) {
            error.message = `cloudinary upload error, ${error.message}`;
            throw error;
        }
        else {
            // Handle cases where error is not an instance of Error
            throw new Error(`cloudinary upload error, ${String(error)}`);
        }
    }
});
exports.uploadOnCloudinary = uploadOnCloudinary;
const deleteFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!publicId)
        return;
    try {
        let deleteResponse = yield cloudinary_1.v2.uploader.destroy(publicId);
        return deleteResponse;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteFromCloudinary = deleteFromCloudinary;
