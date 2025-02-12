import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Khai báo kiểu dữ liệu cho biến global
declare global {
  var mongoose: MongooseConn | undefined;
}

// Khởi tạo cached từ biến toàn cục
let cached: MongooseConn = global.mongoose || { conn: null, promise: null };

export const connect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "e-commerce",
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });
  }

  cached.conn = await cached.promise;

  // Lưu cached vào biến global để tái sử dụng
  global.mongoose = cached;

  return cached.conn;
};
