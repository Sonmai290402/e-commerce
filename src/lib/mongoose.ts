"use server";

import mongoose from "mongoose";

let cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached; // Lưu kết nối vào global

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log("✅ Using existing database connection");
    return cached.conn;
  }

  if (!process.env.MONGODB_URL) {
    throw new Error("❌ MONGODB_URL is not set");
  }

  try {
    console.log("🔗 Connecting to MongoDB...");
    cached.promise =
      cached.promise ||
      mongoose.connect(process.env.MONGODB_URL, {
        dbName: "e-commerce",
        bufferCommands: false,
        connectTimeoutMS: 5000, // Timeout nếu mất hơn 5s để kết nối
        socketTimeoutMS: 5000, // Timeout nếu mất hơn 5s để phản hồi
      });

    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
