"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controllers_1 = require("../controllers/comment.controllers");
const verifyUser_middlewares_1 = require("../middlewares/verifyUser.middlewares");
const Router = express_1.default.Router();
Router.route("/create-comment/:id").post(verifyUser_middlewares_1.verifyUser, comment_controllers_1.createComment);
Router.route("/get-comments/:id").get(comment_controllers_1.fetchComments);
exports.default = Router;
