import dotenv from 'dotenv';
import express, { type Express, type Request, type Response } from 'express';
import { connectToDatabase, getDatabase } from './db.js';
import { ensureTasksCollection } from './setup/tasksCollection.js';
import { errorHandler } from './http/middleware/errorHandler.js';
import { notFound } from './http/middleware/notFound.js';
import tasksRouter from './routes/tasks.js';
import { fileURLToPath } from 'url';

dotenv.config();

export const app: Express = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export async function start(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'task_manager_dev';
  const db = await connectToDatabase({ uri, dbName });
  await ensureTasksCollection(db);

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

// core middleware
app.use(express.json());

// api routes
app.use('/api/tasks', tasksRouter);

// health route remains
app.get('/db/ping', async (_req: Request, res: Response) => {
  try {
    const db = getDatabase();
    await db.command({ ping: 1 });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

// not found + error handling
app.use(notFound);
app.use(errorHandler);

// ESM equivalent of require.main === module
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  start().catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
}


