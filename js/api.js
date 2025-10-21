// URL base da API
const PRODUCTION_API_URL = 'https://sunnyata-investiments.onrender.com/api'; // ✅ URL do Render configurada

const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : PRODUCTION_API_URL;

// Classe para gerenciar chamadas à API
class API {
    // Login/Registro
    static async login(username = '') {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    // Obter dados do usuário
    static async getUser() {
        try {
            const response = await fetch(`${API_URL}/user`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    // Comprar ações
    static async buyStock(symbol, quantity, price) {
        try {
            const response = await fetch(`${API_URL}/portfolio/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbol, quantity, price })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao comprar:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    // Vender ações
    static async sellStock(symbol, quantity, price) {
        try {
            const response = await fetch(`${API_URL}/portfolio/sell`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbol, quantity, price })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao vender:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    // Depositar libras
    static async deposit(amount) {
        try {
            const response = await fetch(`${API_URL}/portfolio/deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao depositar:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    // Obter ações do servidor
    static async getStocks() {
        try {
            const response = await fetch(`${API_URL}/stocks`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter ações:', error);
            return { success: false, stocks: [] };
        }
    }

    // Atualizar ações no servidor
    static async updateStocks(stocks) {
        try {
            const response = await fetch(`${API_URL}/stocks/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stocks })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar ações:', error);
            return { success: false };
        }
    }

    // Obter ranking
    static async getRanking() {
        try {
            const response = await fetch(`${API_URL}/ranking`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter ranking:', error);
            return { success: false, ranking: [] };
        }
    }

    // Obter estatísticas de mercado (demanda)
    static async getMarketStats() {
        try {
            const response = await fetch(`${API_URL}/market/stats`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return { success: false, stats: [] };
        }
    }
}

export default API;
