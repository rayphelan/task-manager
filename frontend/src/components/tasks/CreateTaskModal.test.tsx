import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTaskModal } from './CreateTaskModal';

type UiState = { ui: { createModalOpen: boolean } };
vi.mock('../../store/hooks', async () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (sel: (state: UiState) => unknown) => sel({ ui: { createModalOpen: true } }),
}));

vi.mock('../../store/tasksApi', async () => ({
  useCreateTaskMutation: () => [
    vi.fn().mockResolvedValue({ unwrap: async () => ({}) }),
    { isLoading: false },
  ],
}));

describe('CreateTaskModal', () => {
  it('validates required title', async () => {
    render(<CreateTaskModal />);
    const submit = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submit);
    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
  });
});
