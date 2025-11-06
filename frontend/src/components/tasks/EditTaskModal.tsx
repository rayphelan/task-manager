import { useState, useCallback, useEffect, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useGetTaskByIdQuery, useUpdateTaskMutation } from '../../store/tasksApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeEditModal } from '../../store/uiSlice';
import type { TaskStatus } from '../../types/task';

const STATUS_OPTIONS: TaskStatus[] = ['pending', 'in-progress', 'completed'];

export function EditTaskModal() {
  const dispatch = useAppDispatch();
  const editingTaskId = useAppSelector((s) => s.ui.editingTaskId);
  const open = useAppSelector((s) => s.ui.editModalOpen);
  const { data, isFetching } = useGetTaskByIdQuery(editingTaskId ?? '', { skip: !editingTaskId });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description ?? '');
      setStatus(data.status);
      setError(null);
    }
  }, [data]);

  const onClose = useCallback(() => {
    if (isLoading) return;
    setError(null);
    dispatch(closeEditModal());
  }, [dispatch, isLoading]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!editingTaskId) return;
      const trimmed = title.trim();
      if (!trimmed) {
        setError('Title is required');
        return;
      }
      try {
        await updateTask({
          id: editingTaskId,
          title: trimmed,
          description: description.trim() || undefined,
          status,
        }).unwrap();
        onClose();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update task';
        setError(message);
      }
    },
    [editingTaskId, title, description, status, updateTask, onClose],
  );

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <form onSubmit={onSubmit} className="space-y-3">
        {isFetching && <div className="text-sm text-gray-500">Loading…</div>}
        {!isFetching && (
          <>
            <div>
              <label className="mb-1 block text-sm">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Status</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
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
                Save Changes
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
