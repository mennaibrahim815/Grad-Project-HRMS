import axios from "axios";

const instance = axios.create({
  baseURL: "https://grad-project-hrms-production-7.up.railway.app/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);
    if (
      originalRequest.url.includes("/auth/me") ||
      originalRequest.url.includes("/users/")
    ) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (window.location.pathname === "/login") {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        return instance(originalRequest);
      } catch (refreshError) {
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/reset-password"
        ) {
          window.location.replace("/login");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
