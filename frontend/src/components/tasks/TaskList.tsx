import { useCallback, useMemo } from 'react';
import { useGetTasksQuery } from '../../store/tasksApi';
import { useAppDispatch } from '../../store/hooks';
import { openCreateModal, openEditModal, openDeleteConfirm } from '../../store/uiSlice';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Table, THead, TBody, TRow, TCell } from '../ui/Table';
import { StatusBadge } from '../ui/Badge';

export function TaskList() {
  const dispatch = useAppDispatch();
  const { data: tasks, isLoading, isError, refetch } = useGetTasksQuery();

  const handleAdd = useCallback(() => dispatch(openCreateModal()), [dispatch]);
  const handleEdit = useCallback((id: string) => dispatch(openEditModal(id)), [dispatch]);
  const handleDelete = useCallback((id: string) => dispatch(openDeleteConfirm(id)), [dispatch]);

  const rows = useMemo(() => tasks ?? [], [tasks]);

  return (
    <div className="w-full p-4 text-gray-900 dark:text-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={handleAdd}>Add Task</Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Spinner className="h-6 w-6" />
          <span className="ml-2 text-sm text-gray-500">Loading tasks…</span>
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-500 bg-red-50 p-3 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
          <div className="mb-2 text-sm">Failed to load tasks.</div>
          <Button variant="secondary" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="rounded-md border border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
          No tasks yet. Click "Add Task" to create your first task.
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <Table>
          <THead>
            <TRow>
              <TCell span={3}>Title</TCell>
              <TCell span={4}>Description</TCell>
              <TCell span={2}>Status</TCell>
              <TCell span={2} className="text-right">Actions</TCell>
            </TRow>
          </THead>
          <TBody>
            {rows.map((t) => (
              <TRow key={t.id}>
                <TCell span={12} className="md:col-span-3">
                  <div className="truncate font-medium">{t.title}</div>
                </TCell>
                <TCell span={12} className="md:col-span-4">
                  <div className="truncate text-sm text-gray-600 dark:text-gray-300">{t.description || '—'}</div>
                </TCell>
                <TCell span={12} className="md:col-span-2">
                  <StatusBadge status={t.status} />
                </TCell>
                <TCell span={12} className="mt-2 flex w-full flex-col justify-end gap-2 md:col-span-2 md:mt-0 md:flex-row md:space-x-2">
                  <Button variant="secondary" onClick={() => handleEdit(t.id)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(t.id)}>Delete</Button>
                </TCell>
              </TRow>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}


