import { CONFIG } from './config.js';
import { generateCompanies, updateStockPrices } from './stockGenerator.js';
import { renderStocks, updateMarketStats, updateTimeInfo, populateCountryFilter } from './ui.js';
import { filterAndSortStocks, setupFilters } from './filters.js';
import API from './api.js';
import { showLoginModal, renderUserPanel, showDepositModal, showBuyModal, showSellModal } from './portfolio.js';

class StockMarket {
    constructor() {
        this.companies = [];
        this.currentFilter = 'all';
        this.currentSort = 'change';
        this.nextUpdateTime = null;
        this.lastUpdateTime = null; // 🔥 NOVO: Timestamp da última atualização do servidor
        this.updateTimer = null;
        this.clockTimer = null;
        this.user = null;
        this.marketStats = null; // 🔥 NOVO: Estatísticas de mercado
    }

    // Inicializa o sistema
    async init() {
        console.log('🏛️ Inicializando Sunnyata Invests...');
        
        // Faz login/registro
        await this.handleAuth();
        
        // Carrega ou gera dados
        await this.loadOrGenerateData();
        
        // Popula filtros
        populateCountryFilter();
        
        // Configura event listeners
        this.setupEventListeners();
        
        // Renderiza interface
        this.render();
        
        // Inicia temporizadores
        this.startUpdateCycle();
        
        console.log('✅ Sistema inicializado com sucesso!');
    }

    // Faz autenticação
    async handleAuth() {
        // Tenta carregar usuário existente
        const userResult = await API.getUser();
        
        if (userResult.success) {
            this.user = userResult.user;
            this.showNotification(`Bem-vindo de volta, ${this.user.username}!`);
        } else {
            // Mostra modal de login
            this.user = await showLoginModal();
            this.showNotification(`Conta criada! Você ganhou 10.000 libras para começar!`);
        }
    }

    // Carrega dados salvos ou gera novos
    async loadOrGenerateData() {
        // Tenta carregar do servidor
        const stocksResult = await API.getStocks();
        
        if (stocksResult.success && stocksResult.stocks && stocksResult.stocks.length > 0) {
            console.log('📦 Carregando ações do servidor...');
            this.companies = stocksResult.stocks;
            
            // 🔥 NOVO: Sincroniza com o timestamp do servidor
            if (stocksResult.nextUpdate) {
                this.nextUpdateTime = new Date(stocksResult.nextUpdate);
            } else if (stocksResult.lastUpdate) {
                this.nextUpdateTime = new Date(stocksResult.lastUpdate + CONFIG.UPDATE_INTERVAL);
            } else {
                this.nextUpdateTime = new Date(Date.now() + CONFIG.UPDATE_INTERVAL);
            }
            
            if (stocksResult.lastUpdate) {
                this.lastUpdateTime = new Date(stocksResult.lastUpdate);
                console.log(`⏰ Última atualização: ${this.lastUpdateTime.toLocaleTimeString('pt-BR')}`);
                console.log(`⏰ Próxima atualização: ${this.nextUpdateTime.toLocaleTimeString('pt-BR')}`);
            }
        } else {
            console.log('🎲 Gerando novas empresas...');
            this.companies = generateCompanies();
            await this.updatePrices();
        }
    }

    // Atualiza os preços
    async updatePrices() {
        console.log('📊 Atualizando preços...');
        
        // Adiciona classe de animação
        document.getElementById('stocksContainer').classList.add('updating');
        
        this.companies = updateStockPrices(this.companies);
        
        // Salva no servidor e recebe o novo timestamp
        const result = await API.updateStocks(this.companies);
        
        // 🔥 NOVO: Atualiza timestamps baseado na resposta do servidor
        if (result.success) {
            if (result.nextUpdate) {
                this.nextUpdateTime = new Date(result.nextUpdate);
            } else if (result.lastUpdate) {
                this.nextUpdateTime = new Date(result.lastUpdate + CONFIG.UPDATE_INTERVAL);
            }
            
            if (result.lastUpdate) {
                this.lastUpdateTime = new Date(result.lastUpdate);
            }
        }
        
        // Fallback se o servidor não retornar dados
        if (!this.nextUpdateTime) {
            const now = Date.now();
            this.lastUpdateTime = new Date(now);
            this.nextUpdateTime = new Date(now + CONFIG.UPDATE_INTERVAL);
        }
        
        // Remove classe de animação após um tempo
        setTimeout(() => {
            document.getElementById('stocksContainer').classList.remove('updating');
        }, CONFIG.ANIMATION_DURATION);
        
        // Recarrega usuário para atualizar valores
        const userResult = await API.getUser();
        if (userResult.success) {
            this.user = userResult.user;
        }
        
        this.render();
        this.showNotification('Preços atualizados!');
    }

    // Renderiza a interface
    async render() {
        const filtered = filterAndSortStocks(
            this.companies,
            this.currentFilter,
            this.currentSort
        );

        // 🔥 NOVO: Busca estatísticas de mercado
        const statsResult = await API.getMarketStats();
        if (statsResult.success) {
            this.marketStats = statsResult.stats;
        }

        const container = document.getElementById('stocksContainer');
        renderStocks(filtered, container, this.handleBuyClick.bind(this), this.marketStats);
        updateMarketStats(this.companies);
        
        // 🔥 MODIFICADO: Passa lastUpdateTime para mostrar hora correta
        updateTimeInfo(this.lastUpdateTime, this.nextUpdateTime);
        
        // Renderiza painel do usuário
        const userContainer = document.getElementById('userPanel');
        userContainer.innerHTML = renderUserPanel(this.user, this.companies);
        
        // Adiciona listeners aos botões
        this.setupPortfolioListeners();
    }

    // Configura event listeners
    setupEventListeners() {
        setupFilters((country, sort) => {
            this.currentFilter = country;
            this.currentSort = sort;
            this.render();
        });
    }

    // Configura listeners do portfólio
    setupPortfolioListeners() {
        // Botão de depósito
        const depositBtn = document.getElementById('depositBtn');
        if (depositBtn) {
            depositBtn.onclick = () => {
                showDepositModal(async (amount) => {
                    const result = await API.deposit(amount);
                    if (result.success) {
                        this.user = result.user;
                        this.render();
                        this.showNotification(result.message);
                    } else {
                        this.showNotification(result.message, 'error');
                    }
                });
            };
        }

        // Botões de venda
        document.querySelectorAll('.btn-sell').forEach(btn => {
            btn.onclick = () => {
                const symbol = btn.dataset.symbol;
                const price = parseFloat(btn.dataset.price);
                const stock = this.companies.find(s => s.symbol === symbol);
                const holding = this.user.portfolio.find(h => h.symbol === symbol);
                
                if (stock && holding) {
                    showSellModal(stock, holding, async (quantity) => {
                        const result = await API.sellStock(symbol, quantity, price);
                        if (result.success) {
                            this.user = result.user;
                            this.render();
                            this.showNotification(result.message);
                        } else {
                            this.showNotification(result.message, 'error');
                        }
                    });
                }
            };
        });
    }

    // Handler para compra
    handleBuyClick(symbol, price) {
        const stock = this.companies.find(s => s.symbol === symbol);
        if (stock) {
            showBuyModal(stock, async (quantity) => {
                const result = await API.buyStock(symbol, quantity, price);
                if (result.success) {
                    this.user = result.user;
                    this.render();
                    this.showNotification(result.message);
                } else {
                    this.showNotification(result.message, 'error');
                }
            });
        }
    }

    // Mostra notificação
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Inicia o ciclo de atualização
    startUpdateCycle() {
        // Limpa timers existentes
        if (this.updateTimer) clearInterval(this.updateTimer);
        if (this.clockTimer) clearInterval(this.clockTimer);

        // 🔥 NOVO: Calcula quanto tempo falta para a próxima atualização
        const now = Date.now();
        const timeUntilNextUpdate = this.nextUpdateTime ? Math.max(0, this.nextUpdateTime.getTime() - now) : CONFIG.UPDATE_INTERVAL;
        
        console.log(`⏰ Próxima atualização em ${Math.round(timeUntilNextUpdate / 1000)} segundos`);

        // Agenda a primeira atualização no momento correto
        setTimeout(() => {
            this.updatePrices();
            
            // Depois da primeira atualização, configura intervalo regular
            this.updateTimer = setInterval(() => {
                this.updatePrices();
            }, CONFIG.UPDATE_INTERVAL);
        }, timeUntilNextUpdate);

        // Timer para atualizar o relógio a cada segundo
        this.clockTimer = setInterval(() => {
            updateTimeInfo(this.lastUpdateTime, this.nextUpdateTime);
        }, 1000);
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const market = new StockMarket();
    market.init();
});
