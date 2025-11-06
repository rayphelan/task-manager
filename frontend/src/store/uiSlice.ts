import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  createModalOpen: boolean;
  editModalOpen: boolean;
  editingTaskId?: string;
  deleteConfirmForId?: string;
}

const initialState: UiState = {
  createModalOpen: false,
  editModalOpen: false,
  editingTaskId: undefined,
  deleteConfirmForId: undefined,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreateModal(state) {
      state.createModalOpen = true;
    },
    closeCreateModal(state) {
      state.createModalOpen = false;
    },
    openEditModal(state, action: PayloadAction<string>) {
      state.editModalOpen = true;
      state.editingTaskId = action.payload;
    },
    closeEditModal(state) {
      state.editModalOpen = false;
      state.editingTaskId = undefined;
    },
    openDeleteConfirm(state, action: PayloadAction<string>) {
      state.deleteConfirmForId = action.payload;
    },
    closeDeleteConfirm(state) {
      state.deleteConfirmForId = undefined;
    },
  },
});

export const {
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = uiSlice.actions;

export default uiSlice.reducer;


