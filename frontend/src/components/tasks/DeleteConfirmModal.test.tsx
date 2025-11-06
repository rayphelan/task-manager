import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

vi.mock('../../store/hooks', async () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (sel: any) => sel({ ui: { deleteConfirmForId: '1' } }),
}));

vi.mock('../../store/tasksApi', async () => ({
  useDeleteTaskMutation: () => [vi.fn(), { isLoading: false, error: null }],
}));

describe('DeleteConfirmModal', () => {
  it('renders confirmation message', () => {
    render(<DeleteConfirmModal />);
    expect(screen.getByText(/delete this task/i)).toBeInTheDocument();
  });
});


