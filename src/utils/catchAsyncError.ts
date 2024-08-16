import { RequestHandler, Request } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload; 
  }
}

export const catchAsyncError = (fn:RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};
