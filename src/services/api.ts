import axios from 'axios';

const api = axios.create({
  baseURL: 'https://finger-matched-trackback-dover.trycloudflare.com/api/v1', // Replace with your actual API base URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;