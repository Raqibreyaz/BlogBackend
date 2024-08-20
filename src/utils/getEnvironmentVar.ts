import { ApiError } from "./apiError";

export const getEnvironmentVar = (variable: string) => {
  try {
    const value = process.env[variable];
    if (!value) throw new ApiError(400, "environment variable not setted");
    return value;
  } catch (error) {
    throw error;
  }
};
