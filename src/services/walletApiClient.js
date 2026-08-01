import axios from "axios";

export const walletApi = axios.create({
  baseURL: import.meta.env.VITE_WALLET_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

walletApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
