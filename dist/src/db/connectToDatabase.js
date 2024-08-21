import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";


export const connectToDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri)
            throw new ApiError(400, "database url not exists");
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    }
    catch (error) {
        console.log("failed to connect to database");
        process.exit(1);
    }
};
