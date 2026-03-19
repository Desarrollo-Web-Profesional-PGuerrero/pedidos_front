import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL  // ✅ Usa la variable de entorno
});

// Opcional: Agrega un log para verificar
console.log('🚀 API conectada a:', import.meta.env.VITE_API_URL);

export default API;