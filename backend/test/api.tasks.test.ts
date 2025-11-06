import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase, closeDatabase } from '../src/db.js';
import { ensureTasksCollection } from '../src/setup/tasksCollection.js';
import { app } from '../src/server.js';

let mongoServer: MongoMemoryServer;
let createdId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  const dbName = 'api_test_db';
  const db = await connectToDatabase({ uri, dbName });
  await ensureTasksCollection(db);
});

afterAll(async () => {
  await closeDatabase();
  if (mongoServer) await mongoServer.stop();
});

describe('/api/tasks', () => {
  it('POST creates a new task (201)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'My API Task', description: 'desc' })
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ title: 'My API Task', status: 'pending' });
    expect(typeof res.body.data.id).toBe('string');
    expect(res.body.data.createdAt).toBeTruthy();
    createdId = res.body.data.id;
  });

  it('POST rejects invalid payload (400)', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '' }).expect(400);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.error).toBe('string');
  });

  it('GET lists tasks (200)', async () => {
    const res = await request(app).get('/api/tasks').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET filters by status (200)', async () => {
    const res = await request(app).get('/api/tasks?status=pending').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    for (const t of res.body.data) {
      expect(t.status).toBe('pending');
    }
  });

  it('GET by id returns a task (200)', async () => {
    const res = await request(app).get(`/api/tasks/${createdId}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
  });

  it('PATCH updates status (200)', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdId}`)
      .send({ status: 'completed' })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('completed');
  });

  it('PATCH updates title/description (200)', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdId}`)
      .send({ title: 'Edited Title', description: 'Edited Desc' })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Edited Title');
    expect(res.body.data.description).toBe('Edited Desc');
  });

  it('DELETE removes a task (200)', async () => {
    const del = await request(app).delete(`/api/tasks/${createdId}`).expect(200);
    expect(del.body.success).toBe(true);
    const gone = await request(app).get(`/api/tasks/${createdId}`).expect(400);
    expect(gone.body.success).toBe(false);
  });

  it('GET by invalid id returns error (400)', async () => {
    const res = await request(app).get(`/api/tasks/000000000000000000000000`).expect(400);
    expect(res.body.success).toBe(false);
  });
});
