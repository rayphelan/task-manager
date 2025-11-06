import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { connectToDatabase } from './db.js';
import { fileURLToPath } from 'url';

dotenv.config();

export const app: Express = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export async function start(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'task_manager_dev';
  await connectToDatabase({ uri, dbName });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

// ESM equivalent of require.main === module
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  start().catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
}


