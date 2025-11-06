import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase, closeDatabase } from '../src/db.js';
import { ensureTasksCollection } from '../src/setup/tasksCollection.js';
import { validateTaskCreateInput, validateTaskUpdateInput } from '../src/repositories/tasksRepo.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  const dbName = 'test_db_tasks';
  const db = await connectToDatabase({ uri, dbName });
  await ensureTasksCollection(db);
});

afterAll(async () => {
  await closeDatabase();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('zod validation for task inputs', () => {
  it('sets default status to pending on create', () => {
    const parsed = validateTaskCreateInput({ title: 'My Task' });
    expect(parsed.status).toBe('pending');
  });

  it('rejects empty title on create', () => {
    expect(() => validateTaskCreateInput({ title: '' })).toThrow();
  });

  it('rejects empty update object', () => {
    expect(() => validateTaskUpdateInput({})).toThrow();
  });
});

describe('MongoDB $jsonSchema for tasks', () => {
  it('accepts a valid insert', async () => {
    const { default: assert } = await import('node:assert/strict');
    const { getDatabase } = await import('../src/db.js');
    const db = getDatabase();
    const tasks = db.collection('tasks');

    const now = new Date();
    const result = await tasks.insertOne({
      title: 'Valid Task',
      status: 'pending',
      createdAt: now,
    });
    assert.ok(result.insertedId);
  });

  it('rejects missing title', async () => {
    const { getDatabase } = await import('../src/db.js');
    const db = getDatabase();
    const tasks = db.collection('tasks');

    await expect(
      tasks.insertOne({ status: 'pending', createdAt: new Date() })
    ).rejects.toBeTruthy();
  });

  it('rejects invalid status', async () => {
    const { getDatabase } = await import('../src/db.js');
    const db = getDatabase();
    const tasks = db.collection('tasks');

    await expect(
      tasks.insertOne({ title: 'Bad', status: 'nope', createdAt: new Date() })
    ).rejects.toBeTruthy();
  });

  it('requires createdAt (date)', async () => {
    const { getDatabase } = await import('../src/db.js');
    const db = getDatabase();
    const tasks = db.collection('tasks');

    await expect(
      tasks.insertOne({ title: 'Missing Date', status: 'pending' })
    ).rejects.toBeTruthy();
  });
});


