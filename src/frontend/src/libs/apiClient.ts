import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/proxy",
});

export default apiClient;
