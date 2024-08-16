import express from "express";
import {
  fetchUser,
  loginUser,
  registerUser,
} from "../controllers/user.controllers";
import { verifyUser } from "../middlewares/verifyUser.middlewares";

const Router = express.Router();

Router.route("/register-user").post(registerUser);
Router.route("/login-user").post(loginUser);
Router.route("/get-user").get(verifyUser, fetchUser);

export default Router;
