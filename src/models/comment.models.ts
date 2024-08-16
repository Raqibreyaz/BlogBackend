import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,           
        required: true,
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
}, { timestamps: true })

export const commentModel= mongoose.model('comment', commentSchema)