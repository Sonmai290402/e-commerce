import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "e-commerce",
    });

    isConnected = true;
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
