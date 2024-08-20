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
exports.verifyCreator = exports.verifyUser = void 0;
const apiError_1 = require("../utils/apiError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const post_models_1 = require("../models/post.models");
const catchAsyncError_1 = require("../utils/catchAsyncError");
// if token is valid then return the decoded token otherwise return false
const validateToken = (token) => {
    var _a;
    if (!token)
        return false;
    try {
        return jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : "defaultSecret");
    }
    catch (error) {
        return false;
    }
};
const verifyUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => {
    let user = validateToken(req.cookies.userToken);
    if (!user || typeof user === "string")
        throw new apiError_1.ApiError(400, "user is not authenticated for this action");
    req.user = user;
    return next();
});
exports.verifyUser = verifyUser;
// either admin or the owner of the product should be verified
const verifyCreator = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    if (!user)
        throw new apiError_1.ApiError(400, "user is not authenticated for this action");
    if (!req.params.id)
        throw new apiError_1.ApiError(400, "provide post id to process further");
    const post = yield post_models_1.postModel.findOne({ _id: req.params.id });
    if (!post || post.createdBy.toString() !== user.id)
        throw new apiError_1.ApiError(400, "user not authorized for this action");
    req.post = post;
    return next();
}));
exports.verifyCreator = verifyCreator;
