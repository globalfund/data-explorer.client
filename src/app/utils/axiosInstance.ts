import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 120000,
});

export default axiosInstance;
