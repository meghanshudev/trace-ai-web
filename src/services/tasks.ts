import api from './api';

export const getTasks = async (filter_date?: string, limit?: number) => {
  try {
    const params: { filter_date?: string; limit?: number } = {};
    if (filter_date) params.filter_date = filter_date;
    if (limit) params.limit = limit;

    const response = await api.get('/tasks', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (taskId: number, status: string) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (taskId: number) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};