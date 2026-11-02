import { Collection, Db, Document, MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 60_000,
      serverSelectionTimeoutMS: 5_000,
    });
    globalThis._mongoClientPromise = client.connect();
  }

  return globalThis._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(process.env.MONGODB_DB_NAME || undefined);
}

export async function getCollection<T extends Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
