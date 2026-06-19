
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

    // 💡 التعديل الجوهري هنا:
    // لو الطلب اللي فشل هو طلب التأكد من الجلسة (auth/me) أو (users/id)
    // نرفض الطلب بهدوء (Reject) عشان اليوزر يفضل واقف في الـ Splash وميتحولش للوجين غصب عنه
    if (
      originalRequest.url.includes("/auth/me") ||
      originalRequest.url.includes("/users/")
    ) {
      return Promise.reject(error);
    }

    // معالجة الـ 401 للطلبات التانية (زي طلبات الداتا الحقيقية)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // لو إحنا أصلاً في صفحة اللوجين، متبعثش ريفريش
      if (window.location.pathname === "/login") {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        return instance(originalRequest);
      } catch (refreshError) {
        // 💡 تحويل للوجين فقط لو اليوزر كان جوه السيستم فعلاً (مش في الـ Splash)
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
