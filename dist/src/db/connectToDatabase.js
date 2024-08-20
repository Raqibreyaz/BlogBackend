import mongoose from "mongoose";
export const connectToDatabase = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    }
    catch (error) {
        process.exit(1);
    }
};
