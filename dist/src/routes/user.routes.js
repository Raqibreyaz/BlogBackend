"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const verifyUser_middlewares_1 = require("../middlewares/verifyUser.middlewares");
const upload_middlewares_1 = require("../middlewares/upload.middlewares");
const Router = express_1.default.Router();
Router.route("/register-user").post(upload_middlewares_1.upload.single('image'), user_controllers_1.registerUser);
Router.route("/login-user").post(user_controllers_1.loginUser);
Router.route("/get-user").get(verifyUser_middlewares_1.verifyUser, user_controllers_1.fetchUser);
Router.route("/logout-user").post(verifyUser_middlewares_1.verifyUser, user_controllers_1.logoutUser);
exports.default = Router;
