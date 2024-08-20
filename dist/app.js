"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apiError_1 = require("./src/utils/apiError");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const post_routes_1 = __importDefault(require("./src/routes/post.routes"));
const comment_routes_1 = __importDefault(require("./src/routes/comment.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['PUT', 'POST', 'GET', 'PATCH', 'DELETE']
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/posts', post_routes_1.default);
app.use('/api/v1/comments', comment_routes_1.default);
app.use(apiError_1.errorMiddleWare);
exports.default = app;
