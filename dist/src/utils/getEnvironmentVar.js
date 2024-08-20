import { ApiError } from "./apiError.js";
export const getEnvironmentVar = (variable) => {
    try {
        const value = process.env[variable];
        if (!value)
            throw new ApiError(400, "environment variable not setted");
        return value;
    }
    catch (error) {
        throw error;
    }
};
