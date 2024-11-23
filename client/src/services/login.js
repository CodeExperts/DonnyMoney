import { loginAxios } from "./axiosInstances";


export const submitLoginRequest = async (url, data) => {
    try {
      const response = await loginAxios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Error in submitLoginRequest:", error);
      throw error; // 필요 시 호출한 곳으로 에러 전달
    }
  };
  