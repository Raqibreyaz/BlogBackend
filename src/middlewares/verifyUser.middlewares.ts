import mongoose, { MongooseDocumentMiddleware } from "mongoose";
import { ApiError } from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, RequestHandler } from "express";
import { postModel } from "../models/post.models";

interface CustomRequest extends Request {
  user?: JwtPayload;
  post?: mongoose.Document;
}

// if token is valid then return the decoded token otherwise return false
const validateToken = (token: string): JwtPayload | string | false => {
  if (!token) return false;
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY ?? "defaultSecret");
  } catch (error) {
    return false;
  }
};

const verifyUser: RequestHandler = (req: CustomRequest, res, next) => {
  let user = validateToken(req.cookies.userToken);

  if (!user || typeof user === "string")
    return next(new ApiError(400, "user is not authenticated for this action"));

  req.user = user;

  return next();
};

// either admin or the owner of the product should be verified
const verifyCreator: RequestHandler = async (req: CustomRequest, res, next) => {
  let user = req.user;

  if (!user)
    return next(new ApiError(400, "user is not authenticated for this action"));

  if (!req.params.id)
    return next(new ApiError(400, "provide post id to process further"));

  const post = await postModel.findOne({ _id: req.params.id });

  let creatorId = mongoose.Types.ObjectId.createFromHexString(user.id);

  if (!post || post.createdBy !== creatorId)
    return next(new ApiError(400, "user not authorized for this action"));

  req.post = post;

  return next();
};

export { verifyUser, verifyCreator };
