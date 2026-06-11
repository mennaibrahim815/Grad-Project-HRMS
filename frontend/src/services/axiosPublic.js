// services/axiosPublic.js
import axios from "axios";

const axiosPublic = axios.create({
    // baseURL: "https://grad-project-hrms-production.up.railway.app/api",
    baseURL: "https://grad-project-hrms-production-7.up.railway.app",
    timeout: 60000,
  
});

export default axiosPublic;