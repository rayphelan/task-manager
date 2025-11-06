import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';

vi.mock('../../store/tasksApi', async () => {
  return {
    useGetTasksQuery: vi.fn(),
  };
});

type UiState = { ui: { createModalOpen: boolean } };
vi.mock('../../store/hooks', async () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (sel: (state: UiState) => unknown) => sel({ ui: { createModalOpen: false } }),
}));

const { useGetTasksQuery } = await import('../../store/tasksApi');
import type { Mock } from 'vitest';
const mockedUseGetTasksQuery = useGetTasksQuery as unknown as Mock;

describe('TaskList', () => {
  it('shows loading state', () => {
    mockedUseGetTasksQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });
    render(<TaskList />);
    expect(screen.getByText(/Loading tasks/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    mockedUseGetTasksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    render(<TaskList />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('renders rows', () => {
    mockedUseGetTasksQuery.mockReturnValue({
      data: [
        {
          id: '1',
          title: 'A',
          description: 'D',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
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
