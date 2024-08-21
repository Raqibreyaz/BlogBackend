import { v2 as cloudinary, } from "cloudinary";
import fs from "fs";
import envs from "./getEnvironmentVar.js";
cloudinary.config({
    cloud_name: envs.CLOUDINARY_CLOUD_NAME,
    api_key: envs.CLOUDINARY_API_KEY,
    api_secret: envs.CLOUDINARY_API_SECRET,
});
export const uploadOnCloudinary = async (filepath) => {
    if (!filepath)
        return;
    try {
        let uploadResponse = await cloudinary.uploader.upload(filepath);
        fs.unlinkSync(filepath);
        return uploadResponse;
    }
    catch (error) {
        if (error instanceof Error) {
            error.message = `cloudinary upload error, ${error.message}`;
            throw error;
        }
        else {
            // Handle cases where error is not an instance of Error
            throw new Error(`cloudinary upload error, ${String(error)}`);
        }
    }
};
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId)
        return;
    try {
        let deleteResponse = await cloudinary.uploader.destroy(publicId);
        return deleteResponse;
    }
    catch (error) {
        throw error;
    }
};
