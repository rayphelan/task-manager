import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';

vi.mock('../../store/tasksApi', async () => {
  return {
    useGetTasksQuery: vi.fn(),
  };
});

vi.mock('../../store/hooks', async () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (sel: any) => sel({ ui: { createModalOpen: false } }),
}));

const { useGetTasksQuery } = await import('../../store/tasksApi');

describe('TaskList', () => {
  it('shows loading state', () => {
    (useGetTasksQuery as any).mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch: vi.fn() });
    render(<TaskList />);
    expect(screen.getByText(/Loading tasks/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    (useGetTasksQuery as any).mockReturnValue({ data: [], isLoading: false, isError: false, refetch: vi.fn() });
    render(<TaskList />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('renders rows', () => {
    (useGetTasksQuery as any).mockReturnValue({
      data: [
        { id: '1', title: 'A', description: 'D', status: 'pending', createdAt: new Date().toISOString() },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    render(<TaskList />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });
});


