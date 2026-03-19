import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api/v1"
});

export default API;