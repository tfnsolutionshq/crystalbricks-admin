import axios from "axios";

export const idApi = axios.create({
  baseURL: import.meta.env.VITE_ID_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

idApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
