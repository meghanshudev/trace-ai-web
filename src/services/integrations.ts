import api from './api';

export const getIntegrations = async (limit?: number) => {
  try {
    const response = await api.get('/integrations', {
      params: limit ? { limit } : {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const startAuthentication = async (provider: string) => {
  try {
    const response = await api.get(`/auth/${provider}/start`);
    return response.data;
  } catch (error) {
    throw error;
  }
};