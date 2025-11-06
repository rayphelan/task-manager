import { Router, type Request, type Response, type NextFunction } from 'express';
import { created, success } from '../http/responses.js';
import { badRequest } from '../http/errors.js';
import { TaskStatusSchema } from '../validation/taskSchemas.js';
import { createTask, getTaskById, listTasks, updateTaskStatus, validateTaskCreateInput } from '../repositories/tasksRepo.js';

const router = Router();

// POST /api/tasks - Create a new task
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = validateTaskCreateInput(req.body);
    const task = await createTask(input);
    return created(res, task);
  } catch (err) {
    return next(err);
  }
});

// GET /api/tasks - Get all tasks (optional status, limit)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let status: undefined | ReturnType<typeof TaskStatusSchema.parse>;
    if (typeof req.query.status === 'string') {
      status = TaskStatusSchema.parse(req.query.status);
    }
    let limit: number | undefined;
    if (typeof req.query.limit === 'string') {
      const n = Number(req.query.limit);
      if (!Number.isFinite(n) || n <= 0) throw badRequest('limit must be a positive number');
      limit = n;
    }
    const tasks = await listTasks({ status, limit });
    return success(res, tasks);
  } catch (err) {
    return next(err);
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) throw badRequest('Task not found');
    return success(res, task);
  } catch (err) {
    return next(err);
  }
});

// PATCH /api/tasks/:id - Update task status
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof req.body !== 'object' || req.body == null) throw badRequest('Invalid body');
    const status = TaskStatusSchema.parse((req.body as { status?: string }).status);
    const updated = await updateTaskStatus(req.params.id, status);
    if (!updated) throw badRequest('Task not found');
    return success(res, updated);
  } catch (err) {
    return next(err);
  }
});

export default router;


