import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,  // 기본 URL 설정
});

export default api;
