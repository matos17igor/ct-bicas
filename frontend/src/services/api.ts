import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor: Antes de qualquer requisição sair do frontend, ele roda essa função
api.interceptors.request.use((config) => {
  // Busca o token que vamos salvar no navegador logo após o login
  const token = localStorage.getItem("@CTBicas:token");

  if (token) {
    // Se o token existir, injeta no cabeçalho de Autorização no padrão Bearer
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
