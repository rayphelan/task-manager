import { MongoClient, type Db } from 'mongodb';

let mongoClient: MongoClient | null = null;
let database: Db | null = null;

export async function connectToDatabase(params: { uri: string; dbName: string }): Promise<Db> {
  const { uri, dbName } = params;

  if (database && mongoClient) {
    return database;
  }

  if (!uri) {
    throw new Error('connectToDatabase: Missing MongoDB URI');
  }
  if (!dbName) {
    throw new Error('connectToDatabase: Missing MongoDB database name');
  }

  mongoClient = new MongoClient(uri, {
    maxPoolSize: 10,
  });

  await mongoClient.connect();
  database = mongoClient.db(dbName);
  return database;
}

export function getDatabase(): Db {
  if (!database) {
    throw new Error('getDatabase: Database connection has not been initialized');
  }
  return database;
}

export async function closeDatabase(): Promise<void> {
  if (mongoClient) {
    await mongoClient.close();
  }
  mongoClient = null;
  database = null;
}


