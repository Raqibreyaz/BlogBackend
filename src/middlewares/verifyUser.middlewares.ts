import { ApiError } from "../utils/apiError.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, RequestHandler } from "express";
import { postModel } from "../models/post.models.js";
import { postInterface } from "../interfaces/post.interfaces.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import envs from "../utils/getEnvironmentVar.js";

interface CustomRequest extends Request {
  user?: JwtPayload;
  post?: postInterface;
}

// if token is valid then return the decoded token otherwise return false
const validateToken = (token: string): JwtPayload | string | false => {
  if (!token) return false;
  try {
    return jwt.verify(token, envs.JWT_SECRET_KEY!);
  } catch (error) {
    return false;
  }
};

const verifyUser: RequestHandler = catchAsyncError(
  (req: CustomRequest, res, next) => {
    let user = validateToken(req.cookies.userToken);

    if (!user || typeof user === "string")
      throw new ApiError(400, "user is not authenticated for this action");

    req.user = user;

    return next();
  }
);

// either admin or the owner of the product should be verified
const verifyCreator: RequestHandler = catchAsyncError(
  async (req: CustomRequest, res, next) => {
    let user = req.user;

    if (!user)
      throw new ApiError(400, "user is not authenticated for this action");

    if (!req.params.id)
      throw new ApiError(400, "provide post id to process further");

    const post = await postModel.findOne({ _id: req.params.id });

    if (!post || post.createdBy.toString() !== user.id)
      throw new ApiError(400, "user not authorized for this action");

    req.post = post;

    return next();
  }
);

export { verifyUser, verifyCreator };
