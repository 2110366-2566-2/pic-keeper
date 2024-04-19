import axios from "axios";

const apiClientWithAuth = axios.create({
  baseURL: "https://pickeeper.ngrok.app/api/proxy",
});

export default apiClientWithAuth;
