// services/axiosPublic.js
import axios from "axios";

const axiosPublic = axios.create({
    baseURL: "https://grad-project-hrms-production.up.railway.app/api",
    timeout: 60000,
  
});

export default axiosPublic;