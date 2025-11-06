import { useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDeleteTaskMutation } from '../../store/tasksApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { closeDeleteConfirm } from '../../store/uiSlice';

export function DeleteConfirmModal() {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.ui.deleteConfirmForId);
  const open = Boolean(id);
  const [deleteTask, { isLoading, error }] = useDeleteTaskMutation();

  const onClose = useCallback(() => {
    if (isLoading) return;
    dispatch(closeDeleteConfirm());
  }, [dispatch, isLoading]);

  const onConfirm = useCallback(async () => {
    if (!id) return;
    try {
      await deleteTask(id).unwrap();
      onClose();
    } catch {
      // error string is shown below
    }
  }, [id, deleteTask, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Delete Task">
      <div className="space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        {error && (
          <div className="rounded-md border border-red-500 bg-red-50 p-2 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
            {getErrorMessage(error)}
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function getErrorMessage(err: unknown): string {
  const fbq = err as FetchBaseQueryError;
  if (fbq && 'data' in fbq) {
    const data = fbq.data as unknown;
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data !== null) {
      const maybe = data as { error?: string; message?: string };
      if (maybe.error) return maybe.error;
      if (maybe.message) return maybe.message;
    }
  }
  const ser = err as SerializedError;
  if (ser && ser.message) return ser.message;
  return 'Failed to delete task';
}
