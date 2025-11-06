import type { TaskDTO, TaskStatus } from '../models/task.js';
import {
  TaskCreateInputSchema,
  TaskUpdateInputSchema,
  type TaskCreateInput,
  type TaskUpdateInput,
} from '../validation/taskSchemas.js';
import { getDatabase } from '../db.js';
import { ObjectId, type WithId } from 'mongodb';
import type { TaskDocument } from '../models/task.js';

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

export async function createTask(input: TaskCreateInput): Promise<TaskDTO> {
  const validated = validateTaskCreateInput(input);
  const title = validated.title;
  const description = validated.description;
  const status: TaskStatus = validated.status ?? 'pending';
  const createdAt = new Date();
  const db = getDatabase();
  const collection = db.collection<TaskDocument>('tasks');
  const toInsert: Partial<TaskDocument> = { title, status, createdAt };
  if (typeof description === 'string') {
    toInsert.description = description;
  }
  const insertResult = await collection.insertOne(toInsert as unknown as TaskDocument);
  const doc: WithId<TaskDocument> = {
    _id: insertResult.insertedId as unknown as ObjectId,
    title,
    description: toInsert.description,
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

export async function listTasks(params?: {
  status?: TaskStatus;
  limit?: number;
}): Promise<TaskDTO[]> {
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

export async function updateTask(
  id: string,
  updates: Partial<{ title: string; description?: string; status: TaskStatus }>,
): Promise<TaskDTO | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = getDatabase();
  const collection = db.collection<TaskDocument>('tasks');
  const $set: Record<string, unknown> = {};
  if (Object.prototype.hasOwnProperty.call(updates, 'title') && typeof updates.title === 'string') {
    $set.title = updates.title;
  }
  if (
    Object.prototype.hasOwnProperty.call(updates, 'description') &&
    typeof updates.description === 'string'
  ) {
    $set.description = updates.description;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'status') && updates.status) {
    $set.status = updates.status;
  }
  if (Object.keys($set).length === 0) return null;
  const filter = { _id: new ObjectId(id) };
  const upd = await collection.updateOne(filter, { $set });
  if (upd.matchedCount === 0) return null;
  const found = await collection.findOne(filter);
  return found ? toTaskDTO(found as WithId<TaskDocument>) : null;
}

export async function deleteTask(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = getDatabase();
  const collection = db.collection<TaskDocument>('tasks');
  const res = await collection.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount === 1;
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
