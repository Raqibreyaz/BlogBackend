import mongoose, { Document } from "mongoose";

export interface postInterface extends Document {
  title: string;
  content: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  image: {
    url: string;
    public_id: string;
  };
}
