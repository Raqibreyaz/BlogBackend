import mongoose from "mongoose";
import { postInterface } from "../interfaces/post.interfaces.js";

export const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const postSchema:mongoose.Schema<postInterface> = new mongoose.Schema<postInterface>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      minLength: [10, "content must be at least of 10 characters"],
    },
    image: {
      type: imageSchema,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const postModel = mongoose.model<postInterface>("post", postSchema);
