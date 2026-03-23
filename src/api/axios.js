import axios from "axios";

const API = axios.create({
  baseURL: "https://mediskinweb-backend.onrender.com", // change if deployed
});

export default API;
