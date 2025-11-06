import { MongoClient } from 'mongodb';

let mongoClient = null;
let database = null;

export async function connectToDatabase({ uri, dbName }) {
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

export function getDatabase() {
  if (!database) {
    throw new Error('getDatabase: Database connection has not been initialized');
  }
  return database;
}

export async function closeDatabase() {
  if (mongoClient) {
    await mongoClient.close();
  }
  mongoClient = null;
  database = null;
}


