import axios from "axios";

// 로그인 전용 Axios 인스턴스
export const loginAxios = axios.create({
  baseURL: "http://52.79.249.178:9999", // 로그인 전용 서버 URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 기본 Axios 설정
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://52.79.249.178/api"; // 기본 API URL
axios.defaults.headers.common["Content-Type"] = "application/json";
