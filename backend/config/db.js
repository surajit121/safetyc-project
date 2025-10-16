import mongoose from "mongoose";

export const dbconnect = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI not found in environment");
    }

    // Prefer strict queries in production
    mongoose.set("strictQuery", true);

    await mongoose.connect(uri);
    console.log("mongo_db connected successfully");
};