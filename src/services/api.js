import axios from "axios";
import { showError } from "../utils/notify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jaringan terputus atau server tidak bisa dijangkau sama sekali
    // error.request ada tapi error.response tidak ada = tidak dapat respons dari server
    if (!error.response && error.request) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        showError("Koneksi timeout. Periksa jaringan Anda dan coba lagi.");
      } else {
        showError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      const isLoginRequest = error.config?.url?.includes("/login");

      // Hanya redirect jika bukan dari halaman login
      // dan user sebelumnya sudah punya token (sesi expired)
      if (token && !isLoginRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?session=expired";
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    if (error.response?.status >= 500) {
      window.location.href = "/server-error";
    }

    return Promise.reject(error);
  },
);

export default api;