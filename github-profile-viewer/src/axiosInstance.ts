import axios from 'axios';

// Criação de uma instância do axios com configurações padrão
const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',  // Base URL para a API
  timeout: 10000,  // Tempo de timeout (em ms)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
