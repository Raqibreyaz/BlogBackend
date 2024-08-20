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
exports.deletePost = exports.updatePost = exports.fetchPosts = exports.fetchPostDetails = exports.createPost = void 0;
const catchAsyncError_1 = require("../utils/catchAsyncError");
const apiError_1 = require("../utils/apiError");
const cloudinary_js_1 = require("../utils/cloudinary.js");
const post_models_1 = require("../models/post.models");
const mongoose_1 = __importDefault(require("mongoose"));
// this function just adds a new product
const createPost = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!req.user)
        throw new apiError_1.ApiError(400, "user not available");
    if (!title || !content || !req.file)
        throw new apiError_1.ApiError(400, "provide all details to create post");
    const cloudinaryResponse = yield (0, cloudinary_js_1.uploadOnCloudinary)(req.file.path);
    if (!cloudinaryResponse)
        return;
    yield post_models_1.postModel.create({
        title,
        content,
        image: {
            url: cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.url,
            public_id: cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.public_id,
        },
        createdBy: req.user.id,
    });
    res.status(200).json({
        success: true,
        message: "post created successfully",
    });
}));
exports.createPost = createPost;
// this function is responsible for fetching posts either with search param or direct
const fetchPosts = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //  find posts by a given search query param
    let { search = "", page = 1, limit = 10 } = req.query;
    page = typeof page === "string" ? parseInt(page) : page;
    limit = typeof limit === "string" ? parseInt(limit) : limit;
    if (typeof page !== "number" ||
        typeof limit !== "number" ||
        typeof search !== "string")
        throw new apiError_1.ApiError(400, "invalid query params provided");
    //   find all the posts where the title is included in case insensitive mannerF
    const result = yield post_models_1.postModel.aggregate([
        {
            $facet: {
                data: [
                    {
                        $match: {
                            title: { $regex: search, $options: "i" },
                        },
                    },
                    {
                        $skip: (page - 1) * limit,
                    },
                    {
                        $limit: limit,
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "creatorDetails",
                        },
                    },
                    { $unwind: "$creatorDetails" },
                    {
                        $project: {
                            title: 1,
                            creator: {
                                _id: "$createdBy",
                                username: "$creatorDetails.username",
                            },
                            createdAt: 1,
                            image: "$image.url",
                        },
                    },
                ],
                totalPosts: [
                    {
                        $count: "count",
                    },
                ],
            },
        },
    ]);
    const { data: posts, totalPosts } = result[0];
    const noOfPosts = totalPosts[0].count;
    res.status(200).json({
        success: true,
        message: "posts fetched successfully",
        posts,
        totalPages: Math.ceil((noOfPosts === 0 ? 1 : noOfPosts) / limit),
    });
}));
exports.fetchPosts = fetchPosts;
// this function will fetch the whole details of the post
const fetchPostDetails = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // take the post id from params
    const { id } = req.params;
    const post = yield post_models_1.postModel.aggregate([
        {
            $match: {
                _id: mongoose_1.default.Types.ObjectId.createFromHexString(id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creatorDetails",
            },
        },
        { $unwind: "$creatorDetails" },
        {
            $project: {
                title: 1,
                content: 1,
                creator: { _id: "$createdBy", username: "$creatorDetails.username", image: "$creatorDetails.image.url" },
                createdAt: 1,
                image: "$image.url",
            },
        },
    ]);
    if (post.length === 0)
        throw new apiError_1.ApiError(400, "post not found");
    res.status(200).json({
        success: true,
        message: "post fetched successfully",
        post: post[0],
    });
}));
exports.fetchPostDetails = fetchPostDetails;
// this function will be used to update post
const updatePost = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = req.post;
    const { body, file } = req;
    const { title, content } = body;
    if (!title && !content && !file)
        throw new apiError_1.ApiError(400, "provide something to update");
    if (!post)
        throw new apiError_1.ApiError(400, "post not found");
    const oldImagePublicId = post.image.public_id;
    const toUpdate = {};
    //   when a new image is provided then upload to cloudinary and add to updator object
    if (file) {
        const cloudinaryResponse = yield (0, cloudinary_js_1.uploadOnCloudinary)(file.path);
        if (cloudinaryResponse)
            toUpdate.image = {
                url: cloudinaryResponse.url,
                public_id: cloudinaryResponse.public_id,
            };
    }
    if (title)
        toUpdate.title = title;
    if (content)
        toUpdate.content = content;
    yield post_models_1.postModel.findByIdAndUpdate(req.params.id, {
        $set: toUpdate,
    });
    //   after saving the updated post delete the oldImagePublicId if new image was provided
    if (toUpdate.image)
        yield (0, cloudinary_js_1.deleteFromCloudinary)(oldImagePublicId);
    res.status(200).json({
        success: true,
        message: "post updated successfully",
    });
}));
exports.updatePost = updatePost;
const deletePost = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = req.post;
    if (!post)
        throw new apiError_1.ApiError(404, "post not found");
    // delete the post now
    yield post_models_1.postModel.deleteOne({ _id: post._id });
    // delete  the image of the post from cloudinary
    yield (0, cloudinary_js_1.deleteFromCloudinary)(post.image.public_id);
    res.status(200).json({
        success: true,
        message: "post deleted successfully",
    });
}));
exports.deletePost = deletePost;
