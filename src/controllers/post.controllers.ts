import { catchAsyncError } from "../utils/catchAsyncError";
import { ApiError } from "../utils/apiError";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { postModel } from "../models/post.models";

// this function just adds a new product
const createPost = catchAsyncError(async (req, res, next) => {
  const { title, content } = req.body;

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
  const { search = "" } = req.query;

  //   find all the posts where the title is included in case insensitive mannerF
  const posts = await postModel.aggregate([
    {
      $match: {
        title: { $regex: search, $options: "i" },
      },
      $project: {
        title: 1,
        createdBy: 1,
        createdAt: 1,
        image: "$image.url",
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "posts fetched successfully",
    posts,
  });
});

// this function will fetch the whole details of the post
const fetchPostDetails = catchAsyncError(async (req, res, next) => {
  // take the post id from params
  const { id } = req.params;

  const post = await postModel.aggregate([
    {
      $match: {
        _id: id,
      },
      $project: {
        title: 1,
        content: 1,
        createdBy: 1,
        createdAt: 1,
        image: "$image.url",
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "post fetched successfully",
    post,
  });
});

// this function will be used to update post
const updatePost = catchAsyncError(async (req, res, next) => {
  if (!req.params.id)
    throw new ApiError(400, "provide product id to update product");

  const {
    body: { title, content },
    file,
  } = req;

  if (!title && !content && !file)
    throw new ApiError(400, "provide something to update");

  let post = await postModel.findById(req.params.id);

  if (!post) throw new ApiError(400, "post not found");

  const oldImagePublicId = post.image.public_id;

  let isNewImageProvided = false;

  const toUpdate: {
    image?: { url: string; public_id: string };
    title?: string;
    content?: string;
  } = {};

  //   when a new image is provided then upload to cloudinary and add to updator object
  if (file) {
    isNewImageProvided = true;
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
  if (isNewImageProvided) await deleteFromCloudinary(oldImagePublicId);

  res.status(200).json({
    success: true,
    message: "post updated successfully",
  });
});

export { createPost, fetchPostDetails, fetchPosts, updatePost };
