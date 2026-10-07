import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://resume-screening-ai-production-0d77.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;