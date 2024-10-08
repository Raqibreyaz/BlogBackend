import express from "express";
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/verifyUser.middlewares.js";
import { upload } from "../middlewares/upload.middlewares.js";

const Router = express.Router();

Router.route("/register-user").post(upload.single('image'),registerUser);
Router.route("/login-user").post(loginUser);
Router.route("/get-user").get(verifyUser, fetchUser);
Router.route("/logout-user").post(verifyUser, logoutUser);

export default Router;
