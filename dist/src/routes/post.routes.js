"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controllers_1 = require("../controllers/post.controllers");
const verifyUser_middlewares_1 = require("../middlewares/verifyUser.middlewares");
const upload_middlewares_1 = require("../middlewares/upload.middlewares");
const Router = express_1.default.Router();
Router.route("/")
    .get(post_controllers_1.fetchPosts)
    .post(verifyUser_middlewares_1.verifyUser, upload_middlewares_1.upload.single("image"), post_controllers_1.createPost);
Router.route("/:id")
    .get(post_controllers_1.fetchPostDetails)
    .put(verifyUser_middlewares_1.verifyUser, verifyUser_middlewares_1.verifyCreator, upload_middlewares_1.upload.single("image"), post_controllers_1.updatePost)
    .delete(verifyUser_middlewares_1.verifyUser, verifyUser_middlewares_1.verifyCreator, post_controllers_1.deletePost);
exports.default = Router;
