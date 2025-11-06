import type { TaskDTO, TaskStatus } from '../models/task.js';
import { TaskCreateInputSchema, TaskUpdateInputSchema, type TaskCreateInput, type TaskUpdateInput } from '../validation/taskSchemas.js';

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
  throw new Error('Not implemented');
}

export async function getTaskById(id: string): Promise<TaskDTO | null> {
  throw new Error('Not implemented');
}

export async function listTasks(params?: { status?: TaskStatus; limit?: number }): Promise<TaskDTO[]> {
  throw new Error('Not implemented');
}


