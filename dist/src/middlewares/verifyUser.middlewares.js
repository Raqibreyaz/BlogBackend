import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { postModel } from "../models/post.models.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import envs from "../utils/getEnvironmentVar.js";
// if token is valid then return the decoded token otherwise return false
const validateToken = (token) => {
    if (!token)
        return false;
    try {
        return jwt.verify(token, envs.JWT_SECRET_KEY);
    }
    catch (error) {
        return false;
    }
};
const verifyUser = catchAsyncError((req, res, next) => {
    let user = validateToken(req.cookies.userToken);
    if (!user || typeof user === "string")
        throw new ApiError(400, "user is not authenticated for this action");
    req.user = user;
    return next();
});
// either admin or the owner of the product should be verified
const verifyCreator = catchAsyncError(async (req, res, next) => {
    let user = req.user;
    if (!user)
        throw new ApiError(400, "user is not authenticated for this action");
    if (!req.params.id)
        throw new ApiError(400, "provide post id to process further");
    const post = await postModel.findOne({ _id: req.params.id });
    if (!post || post.createdBy.toString() !== user.id)
        throw new ApiError(400, "user not authorized for this action");
    req.post = post;
    return next();
});
export { verifyUser, verifyCreator };
