"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getEnvironmentVar_1 = require("./getEnvironmentVar");
const assignJwtToken = (user, res, message) => {
    let tokenName = `userToken`;
    let token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, (0, getEnvironmentVar_1.getEnvironmentVar)("JWT_SECRET_KEY"), { expiresIn: (0, getEnvironmentVar_1.getEnvironmentVar)("JWT_EXPIRY") });
    res
        .status(200)
        .cookie(tokenName, token, {
        expires: new Date(Date.now() + parseInt((0, getEnvironmentVar_1.getEnvironmentVar)("COOKIE_EXPIRY")) * 1000 * 86400),
        httpOnly: true,
    })
        .json({
        success: true,
        message,
    });
};
exports.assignJwtToken = assignJwtToken;
