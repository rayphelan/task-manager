import { z } from 'zod';
import type { TaskStatus } from '../models/task.js';

export const TaskStatusSchema = z.enum(['pending', 'in-progress', 'completed']) as z.ZodType<TaskStatus>;

// Input for creating a task (client payload):
// - title required, non-empty
// - description optional
// - status optional, defaults to 'pending' (we'll set the default in server/repo)
// - createdAt is server-controlled and not accepted from client
export const TaskCreateInputSchema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().optional(),
  status: TaskStatusSchema.optional(),
});

// Input for updating a task (client payload):
// - partial updates allowed for title/description/status
// - createdAt is immutable and not accepted
export const TaskUpdateInputSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: TaskStatusSchema.optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type TaskCreateInput = z.infer<typeof TaskCreateInputSchema>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateInputSchema>;


