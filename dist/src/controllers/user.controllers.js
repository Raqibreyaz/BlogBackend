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
exports.logoutUser = exports.fetchUser = exports.loginUser = exports.registerUser = void 0;
const apiError_1 = require("../utils/apiError");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const assignJwtToken_1 = require("../utils/assignJwtToken");
const cloudinary_1 = require("../utils/cloudinary");
const user_models_1 = require("../models/user.models");
const mongoose_1 = __importDefault(require("mongoose"));
const registerUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, email, password } = req.body;
    if (!username || !email || !password)
        throw new apiError_1.ApiError(400, "Provide all details to register user");
    if (password.length < 8)
        throw new apiError_1.ApiError(400, "password must be at least 8 characters");
    if (yield user_models_1.userModel.findOne({ email }))
        throw new apiError_1.ApiError(400, "user with this email already exists");
    if (!req.file)
        throw new apiError_1.ApiError(400, "provide user image");
    const cloudinaryResponse = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
    if (cloudinaryResponse) {
        // create the user
        const user = yield user_models_1.userModel.create({
            username,
            email,
            password,
            image: {
                url: cloudinaryResponse.url,
                public_id: cloudinaryResponse.public_id,
            },
        });
        (0, assignJwtToken_1.assignJwtToken)(user, res, "user registered successfully");
    }
}));
exports.registerUser = registerUser;
const loginUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        throw new apiError_1.ApiError(400, "fill full form");
    const user = yield user_models_1.userModel.findOne({ email });
    if (!user)
        throw new apiError_1.ApiError(404, "user does not exist");
    let checkPassword = yield user.comparePassword(password);
    if (!checkPassword)
        throw new apiError_1.ApiError(400, "invalid credentials");
    (0, assignJwtToken_1.assignJwtToken)(user, res, "user logged in successfully");
}));
exports.loginUser = loginUser;
const fetchUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new apiError_1.ApiError(400, "user unavailable");
    const result = yield user_models_1.userModel.aggregate([
        {
            $match: { _id: mongoose_1.default.Types.ObjectId.createFromHexString(req.user.id) },
        },
        {
            $project: {
                username: 1,
                email: 1,
                image: "$image.url",
            },
        },
    ]);
    if (result.length === 0)
        throw new apiError_1.ApiError(404, "user does not exist");
    res.status(200).json({
        success: true,
        message: "user fetched successfully",
        user: result[0],
    });
}));
exports.fetchUser = fetchUser;
const logoutUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(200)
        .cookie("userToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
        .json({
        success: true,
        message: "user logged out successfully",
    });
}));
exports.logoutUser = logoutUser;
