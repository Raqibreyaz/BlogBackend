import { catchAsyncError } from "../utils/catchAsyncError.js";
import { ApiError } from "../utils/apiError.js";
import { commentModel } from "../models/comment.models.js";
import mongoose from "mongoose";
const createComment = catchAsyncError(async (req, res, next) => {
    if (!req.params.id)
        throw new ApiError(400, "post id is required");
    const { content } = req.body;
    if (!content)
        throw new ApiError(400, "provide content to create and add comment");
    if (!req.user)
        throw new ApiError(400, "user unavailable");
    await commentModel.create({
        createdBy: req.user.id,
        content,
        postId: req.params.id,
    });
    res.status(200).json({
        success: true,
        message: "comment added sucessfully",
    });
});
const fetchComments = catchAsyncError(async (req, res, next) => {
    if (!req.params.id)
        throw new ApiError(400, "post id is required");
    let { page = 1, limit = 10 } = req.query;
    page = typeof page === "string" ? parseInt(page) : page;
    limit = typeof limit === "string" ? parseInt(limit) : limit;
    if (typeof page !== "number" || typeof limit !== "number")
        throw new ApiError(400, "page or limit must be a number");
    const postId = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    const result = await commentModel.aggregate([
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
});
export { fetchComments, createComment };
