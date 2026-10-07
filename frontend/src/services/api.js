import axios from 'axios';

// Directly set the base URL with /api
const api = axios.create({
  baseURL: 'https://resume-screening-ai-production-0d77.up.railway.app/api',
});

export default api;