import mongoose from "mongoose";

export const connectToDatabase = async () : Promise<void> => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
  } catch (error) {
    process.exit(1)    
  }
};
