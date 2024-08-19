import { RequestHandler, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { postInterface } from "../interfaces/post.interfaces";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
    post?: postInterface;
  }
}

export const catchAsyncError = (fn: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
