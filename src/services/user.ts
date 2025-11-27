import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await api.put('/users/me', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};