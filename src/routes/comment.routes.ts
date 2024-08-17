import express from "express";
import {
  createComment,
  fetchComments,
} from "../controllers/comment.controllers";
import { verifyUser } from "../middlewares/verifyUser.middlewares";

const Router = express.Router();

Router.route("/create-comment/:id").post(verifyUser, createComment);
Router.route("/get-comments/:id").get(fetchComments);

export default Router;
