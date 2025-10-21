// Configuração para produção
// Substitua a URL abaixo pela URL do seu backend no Render/Railway
export const PRODUCTION_API_URL = 'https://SEU-APP.onrender.com/api';

// Se estiver rodando localmente, mantenha localhost
export const DEVELOPMENT_API_URL = 'http://localhost:3000/api';

// Detecta automaticamente o ambiente
export const API_BASE_URL = window.location.hostname === 'localhost' 
    ? DEVELOPMENT_API_URL 
    : PRODUCTION_API_URL;
