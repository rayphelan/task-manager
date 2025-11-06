import type { TaskDTO, TaskStatus } from '../models/task.js';
import { TaskCreateInputSchema, TaskUpdateInputSchema, type TaskCreateInput, type TaskUpdateInput } from '../validation/taskSchemas.js';
import { getDatabase } from '../db.js';
import { ObjectId, type WithId } from 'mongodb';
import type { TaskDocument } from '../models/task.js';

// Validation helpers (runtime):
export function validateTaskCreateInput(input: unknown): TaskCreateInput {
  const parsed = TaskCreateInputSchema.parse(input);
  return {
    description: parsed.description,
    title: parsed.title,
    status: parsed.status ?? 'pending',
  };
}

export function validateTaskUpdateInput(input: unknown): TaskUpdateInput {
  return TaskUpdateInputSchema.parse(input);
}

// Repository function signatures (implementation will follow):
export async function createTask(input: TaskCreateInput): Promise<TaskDTO> {
  // Ensure defaults via validation layer as defense-in-depth
  const validated = validateTaskCreateInput(input);
  const title = validated.title;
  const description = validated.description;
  const status: TaskStatus = (validated.status ?? 'pending');
  const createdAt = new Date();
  const db = getDatabase();
  const collection = db.collection<TaskDocument>('tasks');
  const insertResult = await collection.insertOne({ title, description, status, createdAt } as unknown as TaskDocument);
  const doc: WithId<TaskDocument> = {
    _id: insertResult.insertedId as unknown as ObjectId,
    title,
    description,
    status,
    createdAt,
  };
  return toTaskDTO(doc);
}

export async function getTaskById(id: string): Promise<TaskDTO | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = getDatabase();
  const collection = db.collection<TaskDocument>('tasks');
  const found = await collection.findOne({ _id: new ObjectId(id) });
  return found ? toTaskDTO(found as WithId<TaskDocument>) : null;
}

export async function listTasks(params?: { status?: TaskStatus; limit?: number }): Promise<TaskDTO[]> {
  const db = getDatabase();
  const collection = db.collection<TaskDocument>('tasks');
  const query: Record<string, unknown> = {};
  if (params?.status) {
    query.status = params.status;
  }
  const limit = params?.limit && params.limit > 0 ? params.limit : 50;
  const cursor = collection.find(query).sort({ createdAt: -1 }).limit(limit);
  const docs = (await cursor.toArray()) as WithId<TaskDocument>[];
  return docs.map(toTaskDTO);
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<TaskDTO | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = getDatabase();
  const collection = db.collection<TaskDocument>('tasks');
  const filter = { _id: new ObjectId(id) };
  const upd = await collection.updateOne(filter, { $set: { status } });
  if (upd.matchedCount === 0) return null;
  const found = await collection.findOne(filter);
  return found ? toTaskDTO(found as WithId<TaskDocument>) : null;
}

function toTaskDTO(doc: WithId<TaskDocument>): TaskDTO {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    status: doc.status,
    createdAt: doc.createdAt,
  };
}


