import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}

export const connectToDatabase = async () => {
  try {
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    cached.promise = 
      cached.promise || 
      mongoose.connect(MONGODB_URL, { 
        dbName: 'Ai-notes',
        bufferCommands: false,
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority'
      })

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database. Please check your connection string and network access.');
  }
}