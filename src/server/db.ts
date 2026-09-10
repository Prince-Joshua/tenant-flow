import mongoose from "mongoose";

declare global {
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

export default function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");

  if (!global.__mongooseConn) {
    global.__mongooseConn = mongoose.connect(uri);
  }
  return global.__mongooseConn;
}
