import { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const assignJwtToken = (
  user: mongoose.Document,
  res: Response,
  message: string
) => {
  let tokenName = `userToken`;

  let token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRY }
  );

  res
    .status(200)
    .cookie(tokenName, token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 1000 * 86400),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
    });
};
