import { Response } from "express";
import { userInterface } from "../interfaces/user.interfaces.js";
import { ApiError } from "./apiError.js";

export const assignJwtToken = (
  user: userInterface,
  res: Response,
  message: string
) => {
  let tokenName = `userToken`;
  const cookieExpiry = process.env.COOKIE_EXPIRY;

  if (!cookieExpiry) {
    console.log("cookie expiry missing", cookieExpiry);
    throw new ApiError(400, "environment variable not setted");
  }

  let token = user.generateToken();

  res
    .status(200)
    .cookie(tokenName, token, {
      expires: new Date(Date.now() + parseInt(cookieExpiry) * 1000 * 86400),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message,
    });
};
