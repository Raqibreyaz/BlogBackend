import mongoose from "mongoose";
import envs from "../utils/getEnvironmentVar.js";
export const connectToDatabase = async () => {
    try {
        await mongoose.connect(`${envs.MONGODB_URI}/${envs.DB_NAME}`);
    }
    catch (error) {
        console.log("failed to connect to database");
        process.exit(1);
    }
};
