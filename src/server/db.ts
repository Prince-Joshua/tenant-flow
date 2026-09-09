import mongoose from 'mongoose';

// Next.js reloads modules on every request in dev and can invoke route
// handlers concurrently, so a plain `mongoose.connect()` call (fine for a
// single long-running Express process) would open a new connection per
// request. We cache the connection promise on `globalThis` instead.
declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

export default function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set');

  if (!global.__mongooseConn) {
    global.__mongooseConn = mongoose.connect(uri);
  }
  return global.__mongooseConn;
}
