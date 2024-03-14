import axios from "axios";

const apiClientWithAuth = axios.create({
  baseURL: "http://localhost:3000/api/proxy",
});

export default apiClientWithAuth;
