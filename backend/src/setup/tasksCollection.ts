import type { Db } from 'mongodb';

const COLLECTION_NAME = 'tasks';

const taskJsonSchema = {
  bsonType: 'object',
  required: ['title', 'status', 'createdAt'],
  properties: {
    title: { bsonType: 'string', description: 'required string', minLength: 1 },
    description: { bsonType: 'string' },
    status: { enum: ['pending', 'in-progress', 'completed'] },
    createdAt: { bsonType: 'date' },
  },
} as const;

export async function ensureTasksCollection(db: Db): Promise<void> {
  const exists = await db.listCollections({ name: COLLECTION_NAME }).hasNext();

  if (!exists) {
    await db.createCollection(COLLECTION_NAME, {
      validator: { $jsonSchema: taskJsonSchema as unknown as Record<string, unknown> },
      validationLevel: 'strict',
    });
  } else {
    await db.command({
      collMod: COLLECTION_NAME,
      validator: { $jsonSchema: taskJsonSchema },
      validationLevel: 'strict',
    });
  }

  const collection = db.collection(COLLECTION_NAME);
  await collection.createIndexes([
    { key: { status: 1 }, name: 'idx_tasks_status' },
    { key: { createdAt: -1 }, name: 'idx_tasks_createdAt_desc' },
  ]);
}
