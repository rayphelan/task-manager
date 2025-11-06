import { useState, useCallback, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useCreateTaskMutation } from '../../store/tasksApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeCreateModal } from '../../store/uiSlice';

export function CreateTaskModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.createModalOpen);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const onClose = useCallback(() => {
    if (isLoading) return;
    setTitle('');
    setDescription('');
    setError(null);
    dispatch(closeCreateModal());
  }, [dispatch, isLoading]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmed = title.trim();
      if (!trimmed) {
        setError('Title is required');
        return;
      }
      try {
        await createTask({ title: trimmed, description: description.trim() || undefined }).unwrap();
        onClose();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create task';
        setError(message);
      }
    },
    [title, description, createTask, onClose],
  );

  return (
    <Modal open={open} onClose={onClose} title="Create Task">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={4}
          />
        </div>
        {error && (
          <div className="rounded-md border border-red-500 bg-red-50 p-2 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
