import { deleteProvidedImage } from "./deleteProvidedImage.js";
import { ErrorRequestHandler } from "express";

class ApiError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

const errorMiddleWare: ErrorRequestHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "internal server error";

  // when image were provided then delete it is waste now
  deleteProvidedImage(req);

  if (error.code === "11000") {
    error.message = `Duplicate Key Found ${Object.keys(error.keyValue)[0]}`;
  }
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export { ApiError, errorMiddleWare };
