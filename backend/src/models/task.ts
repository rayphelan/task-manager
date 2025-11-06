import type { ObjectId } from 'mongodb';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TaskBase {
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
}

export interface TaskDocument extends TaskBase {
  _id: ObjectId;
}

export interface TaskDTO extends TaskBase {
  id: string;
}
