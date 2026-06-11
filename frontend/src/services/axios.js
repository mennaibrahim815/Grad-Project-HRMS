// import axios from "axios";

// // إنشاء Axios Instance
// const instance = axios.create({
//   baseURL: "http://localhost:5000/api",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request Interceptor - إضافة التوكن تلقائياً
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Response Interceptor - معالجة الأخطاء
// let isRedirecting = false;

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // معالجة 401 Unauthorized
//     if (error.response?.status === 401 && !isRedirecting) {
//       isRedirecting = true;

//       // تنظيف البيانات المحلية
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       // التحويل للـ Login
//       window.location.href = "/login";

//       // إعادة تعيين الـ flag بعد ثانية
//       setTimeout(() => {
//         isRedirecting = false;
//       }, 1000);
//     }

//     // معالجة أخطاء الشبكة
//     if (!error.response) {
//       console.error("Network Error:", error.message);
//       return Promise.reject({
//         message: "Network error. Please check your connection.",
//         isNetworkError: true,
//       });
//     }

//     // معالجة أخطاء السيرفر
//     if (error.response?.status >= 500) {
//       console.error("Server Error:", error.response.status);
//       return Promise.reject({
//         message: "Server error. Please try again later.",
//         isServerError: true,
//         status: error.response.status,
//       });
//     }

//     // إرجاع الخطأ الأصلي
//     return Promise.reject(error);
//   },
// );

// export default instance;

import axios from "axios";

const instance = axios.create({
  //baseURL: "https://grad-project-hrms-production.up.railway.app/api",
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

// import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://grad-project-hrms-production.up.railway.app/api",
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // 🚀 flag يمنع تعدد طلبات الريفريش
// let isRefreshing = false;
// let failedQueue = [];

// // إدارة الطلبات اللي كانت مستنية
// const processQueue = (error) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve();
//     }
//   });
//   failedQueue = [];
// };

// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // لو مفيش config نسيب الخطأ يعدي
//     if (!originalRequest) return Promise.reject(error);

//     // ❗ تجاهل الريفريش نفسه
//     if (originalRequest.url.includes("/auth/refresh")) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // لو في refresh شغال بالفعل
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: () => resolve(instance(originalRequest)),
//             reject: (err) => reject(err),
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         await axios.post(
//           "https://grad-project-hrms-production.up.railway.app/api/auth/refresh",
//           {},
//           { withCredentials: true }
//         );

//         processQueue(null);
//         return instance(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError);

//         // 🔥 redirect نظيف بدون loop
//         if (window.location.pathname !== "/login") {
//           window.location.replace("/login");
//         }

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
