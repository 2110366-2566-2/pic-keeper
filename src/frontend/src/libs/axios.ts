import { apiBaseUrl } from "@/constants";
import axios from "axios";

export default axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});
