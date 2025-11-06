export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}
