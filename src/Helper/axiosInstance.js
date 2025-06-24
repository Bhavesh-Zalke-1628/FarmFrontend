import axios from "axios";

// const BASE_URL = "http://localhost:4000/api/v1";
const BASE_URL = "https://farmbackend-qwuw.onrender.com/api/v1";


const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance; 