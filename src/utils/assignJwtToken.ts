import { Response } from "express";
import jwt from "jsonwebtoken";
import { userInterface } from "../interfaces/user.interfaces.js";
import { ApiError } from "./apiError.js";

export const assignJwtToken = (
  user: userInterface,
  res: Response,
  message: string
) => {
  let tokenName = `userToken`;
  const jwtSecret = process.env.JWT_SECRET_KEY;
  const jwtExpiry = process.env.JWT_EXPIRY;
  const cookieExpiry = process.env.COOKIE_EXPIRY;

  if (!jwtSecret || !jwtExpiry || !cookieExpiry)
    throw new ApiError(400, "environment variable not setted");

  let token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, {
    expiresIn: jwtExpiry,
  });

  res
    .status(200)
    .cookie(tokenName, token, {
      expires: new Date(Date.now() + parseInt(cookieExpiry) * 1000 * 86400),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
    });
};
