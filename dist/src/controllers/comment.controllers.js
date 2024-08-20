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
exports.createComment = exports.fetchComments = void 0;
const catchAsyncError_1 = require("../utils/catchAsyncError");
const apiError_1 = require("../utils/apiError");
const comment_models_1 = require("../models/comment.models");
const mongoose_1 = __importDefault(require("mongoose"));
const createComment = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        throw new apiError_1.ApiError(400, "post id is required");
    const { content } = req.body;
    if (!content)
        throw new apiError_1.ApiError(400, "provide content to create and add comment");
    if (!req.user)
        throw new apiError_1.ApiError(400, "user unavailable");
    yield comment_models_1.commentModel.create({
        createdBy: req.user.id,
        content,
        postId: req.params.id,
    });
    res.status(200).json({
        success: true,
        message: "comment added sucessfully",
    });
}));
exports.createComment = createComment;
const fetchComments = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        throw new apiError_1.ApiError(400, "post id is required");
    let { page = 1, limit = 10 } = req.query;
    page = typeof page === "string" ? parseInt(page) : page;
    limit = typeof limit === "string" ? parseInt(limit) : limit;
    if (typeof page !== "number" || typeof limit !== "number")
        throw new apiError_1.ApiError(400, "page or limit must be a number");
    const postId = mongoose_1.default.Types.ObjectId.createFromHexString(req.params.id);
    const result = yield comment_models_1.commentModel.aggregate([
        {
            $facet: {
                data: [
                    {
                        $match: {
                            postId,
                        },
                    },
                    { $sort: { createdAt: -1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "userDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$userDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            content: 1,
                            "userDetails.username": 1,
                            "userDetails.image": "$userDetails.image.url",
                            createdAt: 1,
                        },
                    },
                ],
                commentCount: [{ $match: { postId } }, { $count: "totalComments" }],
            },
        },
    ]);
    const { data: comments, commentCount } = result[0];
    const totalComments = commentCount.length ? commentCount[0].totalComments : 1;
    res.status(200).json({
        success: true,
        message: "comments fetched successfully",
        comments,
        totalComments,
        totalPages: Math.ceil((totalComments === 0 ? 1 : totalComments) / limit),
    });
}));
exports.fetchComments = fetchComments;
