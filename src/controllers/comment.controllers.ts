import { catchAsyncError } from "../utils/catchAsyncError";
import { ApiError } from "../utils/apiError";
import { commentModel } from "../models/comment.models";

// // Define interfaces for request bodies and query parameters
// interface CreateCommentRequest extends Request {
//   params: {
//     id: string;
//   };
//   body: {
//     content: string;
//   };
//   user?: {
//     id: string;
//   };
// }

// interface FetchCommentsRequest extends Request {
//   params: {
//     id: string;
//   };
//   query: {
//     page?: string | number;
//     limit?: string | number;
//   };
// }


const createComment = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) throw new ApiError(400, "post id is required");

  const { content } = req.body;

  if (!content)
    throw new ApiError(400, "provide content to create and add comment");

  if (!req.user) throw new ApiError(400, "user unavailable");

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
  if (!req.params.id) throw new ApiError(400, "post id is required");

  let { page = 1, limit = 10 } = req.query;

  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  if (typeof page !== "number" || typeof limit !== "number")
    throw new ApiError(400, "page or limit must be a number");

  const result = await commentModel.aggregate([
    {
      $facet: {
        data: [
          { $match: {} },
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
              "userDetails.fullname": 1,
              "userDetails.image": "$userDetails.image.url",
              createdAt: 1,
            },
          },
        ],
        commentCount: [{ $count: "filteredTotal" }],
      },
    },
  ]);

  const { data: comments, commentCount } = result[0];

  const filteredTotal = commentCount.length ? commentCount[0].filteredTotal : 0;

  res.status(200).json({
    success: true,
    message: "comments fetched successfully",
    comments,
    filteredTotal,
    totalPages: Math.ceil(filteredTotal / limit),
  });
});

export { fetchComments, createComment };
