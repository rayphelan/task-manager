import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TaskDTO, TaskStatus } from '../types/task';
import { API_BASE_URL } from '../lib/apiClient';

type ApiSuccess<T> = { success: true; data: T };

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTasks: builder.query<TaskDTO[], { status?: TaskStatus; limit?: number } | void>({
      query: (params) => ({ url: '/api/tasks', params: params ?? undefined }),
      transformResponse: (resp: ApiSuccess<TaskDTO[]>) => resp.data,
      providesTags: (result) =>
        result
          ? [
              { type: 'Tasks' as const, id: 'LIST' },
              ...result.map((t) => ({ type: 'Tasks' as const, id: t.id })),
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    getTaskById: builder.query<TaskDTO, string>({
      query: (id) => ({ url: `/api/tasks/${id}` }),
      transformResponse: (resp: ApiSuccess<TaskDTO>) => resp.data,
      providesTags: (_res, _err, id) => [{ type: 'Tasks', id }],
    }),
    createTask: builder.mutation<
      TaskDTO,
      { title: string; description?: string; status?: TaskStatus }
    >({
      query: (body) => ({ url: '/api/tasks', method: 'POST', body }),
      transformResponse: (resp: ApiSuccess<TaskDTO>) => resp.data,
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    updateTask: builder.mutation<
      TaskDTO,
      { id: string; title?: string; description?: string; status?: TaskStatus }
    >({
      query: ({ id, ...patch }) => ({ url: `/api/tasks/${id}`, method: 'PATCH', body: patch }),
      transformResponse: (resp: ApiSuccess<TaskDTO>) => resp.data,
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Tasks', id: arg.id },
        { type: 'Tasks', id: 'LIST' },
      ],
    }),
    updateTaskStatus: builder.mutation<TaskDTO, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({ url: `/api/tasks/${id}`, method: 'PATCH', body: { status } }),
      transformResponse: (resp: ApiSuccess<TaskDTO>) => resp.data,
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Tasks', id: arg.id },
        { type: 'Tasks', id: 'LIST' },
      ],
    }),
    deleteTask: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/api/tasks/${id}`, method: 'DELETE' }),
      transformResponse: (resp: ApiSuccess<{ id: string }>) => resp.data,
      invalidatesTags: (_res, _err, id) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
