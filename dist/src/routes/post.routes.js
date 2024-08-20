import express from "express";
import { createPost, deletePost, fetchPostDetails, fetchPosts, updatePost, } from "../controllers/post.controllers.js";
import { verifyCreator, verifyUser, } from "../middlewares/verifyUser.middlewares.js";
import { upload } from "../middlewares/upload.middlewares.js";
const Router = express.Router();
Router.route("/")
    .get(fetchPosts)
    .post(verifyUser, upload.single("image"), createPost);
Router.route("/:id")
    .get(fetchPostDetails)
    .put(verifyUser, verifyCreator, upload.single("image"), updatePost)
    .delete(verifyUser, verifyCreator, deletePost);
export default Router;
