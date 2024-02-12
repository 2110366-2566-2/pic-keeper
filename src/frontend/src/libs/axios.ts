import axios from "axios";

export default axios.create({
  baseURL: API_BASE_URL,
});

export const axiosAuth = axios.create({
  baseURL: API_BASE_URL,
});
