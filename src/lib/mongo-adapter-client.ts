import { MongoClient } from "mongodb";
import { requireEnv } from "./env";

const uri = requireEnv("MONGODB_URI");
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoAdapterClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoAdapterClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoAdapterClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoAdapterClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
