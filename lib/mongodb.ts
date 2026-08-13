import { MongoClient } from "mongodb";

// Cache the client across hot reloads in development so we don't open a new
// connection pool on every code change.
const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClient(): Promise<MongoClient> {
  if (!globalForMongo.mongoClientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "Missing MONGODB_URI environment variable — set it in .env.local"
      );
    }
    globalForMongo.mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo.mongoClientPromise;
}
