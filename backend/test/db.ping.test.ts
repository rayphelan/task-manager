import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../src/server.js';
import { connectToDatabase, closeDatabase } from '../src/db.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  const dbName = 'test_db';
  await connectToDatabase({ uri, dbName });
});

afterAll(async () => {
  await closeDatabase();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('GET /db/ping', () => {
  it('returns ok: true when DB responds to ping', async () => {
    const response = await request(app).get('/db/ping');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});


