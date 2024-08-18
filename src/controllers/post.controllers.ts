import { catchAsyncError } from "../utils/catchAsyncError";
import { ApiError } from "../utils/apiError";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { postModel } from "../models/post.models";
import mongoose from "mongoose";

interface providedDataType {
  title?: string;
  content?: string;
}

interface postType {
  title: string;
  content?: string;
  image: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

interface fetchedPostsType {
  data: postType[];
  totalPosts: [{ count: number }];
}

// this function just adds a new product
const createPost = catchAsyncError(async (req, res, next) => {
  const { title, content }: providedDataType = req.body;

  if (!req.user) throw new ApiError(400, "user not available");

  if (!title || !content || !req.file)
    throw new ApiError(400, "provide all details to create post");

  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

  if (!cloudinaryResponse) return;

  await postModel.create({
    title,
    content,
    image: {
      url: cloudinaryResponse?.url,
      public_id: cloudinaryResponse?.public_id,
    },
    createdBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "post created successfully",
  });
});

// this function is responsible for fetching posts either with search param or direct
const fetchPosts = catchAsyncError(async (req, res, next) => {
  //  find posts by a given search query param
  let { search = "", page = 1, limit = 10 } = req.query;

  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  if (
    typeof page !== "number" ||
    typeof limit !== "number" ||
    typeof search !== "string"
  )
    throw new ApiError(400, "invalid query params provided");
  //   find all the posts where the title is included in case insensitive mannerF
  const result = await postModel.aggregate([
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

  const { data: posts, totalPosts }: fetchedPostsType = result[0];

  const noOfPosts = totalPosts[0].count;

  res.status(200).json({
    success: true,
    message: "posts fetched successfully",
    posts,
    totalPages: Math.ceil((noOfPosts === 0 ? 1 : noOfPosts) / limit),
  });
});

// this function will fetch the whole details of the post
const fetchPostDetails = catchAsyncError(async (req, res, next) => {
  // take the post id from params
  const { id } = req.params;

  const post = await postModel.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId.createFromHexString(id),
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
        creator: { _id: "$createdBy", username: "$creatorDetails.username",image:"$creatorDetails.image.url" },
        createdAt: 1,
        image: "$image.url",
      },
    },
  ]);

  if (post.length === 0) throw new ApiError(400, "post not found");

  res.status(200).json({
    success: true,
    message: "post fetched successfully",
    post: post[0],
  });
});

// this function will be used to update post
const updatePost = catchAsyncError(async (req, res, next) => {
  const post = req.post;

  const { body, file } = req;

  const { title, content }: providedDataType = body;

  if (!title && !content && !file)
    throw new ApiError(400, "provide something to update");

  if (!post) throw new ApiError(400, "post not found");

  const oldImagePublicId = post.image.public_id;

  const toUpdate: {
    image?: { url: string; public_id: string };
    title?: string;
    content?: string;
  } = {};

  //   when a new image is provided then upload to cloudinary and add to updator object
  if (file) {
    const cloudinaryResponse = await uploadOnCloudinary(file.path);
    if (cloudinaryResponse)
      toUpdate.image = {
        url: cloudinaryResponse.url,
        public_id: cloudinaryResponse.public_id,
      };
  }
  if (title) toUpdate.title = title;
  if (content) toUpdate.content = content;

  await postModel.findByIdAndUpdate(req.params.id, {
    $set: toUpdate,
  });

  //   after saving the updated post delete the oldImagePublicId if new image was provided
  if (toUpdate.image) await deleteFromCloudinary(oldImagePublicId);

  res.status(200).json({
    success: true,
    message: "post updated successfully",
  });
});

const deletePost = catchAsyncError(async (req, res, next) => {
  const post = req.post;

  if (!post) throw new ApiError(404, "post not found");

  // delete the post now
  await postModel.deleteOne({ _id: post._id });

  // delete  the image of the post from cloudinary
  await deleteFromCloudinary(post.image.public_id);

  res.status(200).json({
    success: true,
    message: "post deleted successfully",
  });
});

export { createPost, fetchPostDetails, fetchPosts, updatePost, deletePost };
