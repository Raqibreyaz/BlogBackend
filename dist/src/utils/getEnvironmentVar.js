"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentVar = void 0;
const apiError_1 = require("./apiError");
const getEnvironmentVar = (variable) => {
    try {
        const value = process.env[variable];
        if (!value)
            throw new apiError_1.ApiError(400, "environment variable not setted");
        return value;
    }
    catch (error) {
        throw error;
    }
};
exports.getEnvironmentVar = getEnvironmentVar;
