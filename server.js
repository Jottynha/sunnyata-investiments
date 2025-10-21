import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 30// Obter todas as ações
app.get('/api/stocks', (req, res) => {
    const stockData = loadStocks();
    
    // Se não há dados, retorna array vazio com timestamp atual
    if (!stockData) {
        return res.json({
            success: true,
            stocks: [],
            lastUpdate: Date.now(),
            nextUpdate: getNextUpdateTime()
        });
    }
    
    // Se stockData já tem a estrutura nova (com stocks e lastUpdate)
    if (stockData.stocks) {
        return res.json({
            success: true,
            stocks: stockData.stocks,
            lastUpdate: stockData.lastUpdate || Date.now(),
            nextUpdate: stockData.nextUpdate || getNextUpdateTime()
        });
    }
    
    // Compatibilidade com formato antigo (apenas array de stocks)
    res.json({
        success: true,
        stocks: stockData,
        lastUpdate: Date.now(),
        nextUpdate: getNextUpdateTime()
    });
});

// Atualizar ações (chamado pelo sistema a cada 10min)
app.post('/api/stocks/update', (req, res) => {
    const { stocks } = req.body;
    const now = Date.now();
    saveStocks(stocks, now);
    
    res.json({
        success: true,
        message: 'Ações atualizadas',
        lastUpdate: now,
        nextUpdate: getNextUpdateTime()
    });
});app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Arquivos de dados
const DATA_DIR = join(__dirname, 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const STOCKS_FILE = join(DATA_DIR, 'stocks.json');

// Garante que o diretório data existe
import { mkdirSync } from 'fs';
if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

// Funções auxiliares de armazenamento
function loadUsers() {
    if (existsSync(USERS_FILE)) {
        return JSON.parse(readFileSync(USERS_FILE, 'utf8'));
    }
    return {};
}

function saveUsers(users) {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Função para obter próximo horário de atualização (a cada 10 minutos exatos)
function getNextUpdateTime() {
    const now = new Date();
    const brasiliaOffset = -3 * 60; // UTC-3 em minutos
    const localOffset = now.getTimezoneOffset();
    const offsetDiff = (localOffset - brasiliaOffset) * 60 * 1000;
    
    // Horário de Brasília
    const brasilia = new Date(now.getTime() - offsetDiff);
    
    // Próximo múltiplo de 10 minutos
    const minutes = brasilia.getMinutes();
    const nextMinute = Math.ceil((minutes + 1) / 10) * 10;
    
    brasilia.setMinutes(nextMinute, 0, 0);
    
    // Se passou da hora, vai para próxima hora
    if (nextMinute >= 60) {
        brasilia.setHours(brasilia.getHours() + 1);
        brasilia.setMinutes(0, 0, 0);
    }
    
    // Converte de volta para timestamp UTC
    return brasilia.getTime() + offsetDiff;
}

function loadStocks() {
    if (existsSync(STOCKS_FILE)) {
        const data = JSON.parse(readFileSync(STOCKS_FILE, 'utf8'));
        // Retorna objeto com stocks e timestamp
        if (data.stocks) {
            return data;
        }
        // Compatibilidade com formato antigo
        return { 
            stocks: data, 
            lastUpdate: Date.now(),
            nextUpdate: getNextUpdateTime()
        };
    }
    return null;
}

function saveStocks(stocks, lastUpdate = Date.now()) {
    const data = {
        stocks,
        lastUpdate,
        nextUpdate: getNextUpdateTime()
    };
    writeFileSync(STOCKS_FILE, JSON.stringify(data, null, 2));
}

// Middleware para obter IP real
function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress;
}

// ROTAS DA API

// Login/Registro automático por IP
app.post('/api/auth/login', (req, res) => {
    const ip = getClientIP(req);
    const { username } = req.body;
    
    const users = loadUsers();
    
    // Verifica se o IP já tem um usuário
    if (users[ip]) {
        return res.json({
            success: true,
            user: users[ip],
            message: 'Bem-vindo de volta!'
        });
    }
    
    // Cria novo usuário
    const newUser = {
        ip,
        username: username || `Investidor_${Object.keys(users).length + 1}`,
        balance: 10000, // Saldo inicial de 10.000 libras
        portfolio: [], // { symbol, quantity, avgPrice, totalInvested }
        transactions: [], // Histórico
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
    
    users[ip] = newUser;
    saveUsers(users);
    
    res.json({
        success: true,
        user: newUser,
        message: 'Conta criada com sucesso!'
    });
});

// Obter dados do usuário
app.get('/api/user', (req, res) => {
    const ip = getClientIP(req);
    const users = loadUsers();
    
    if (!users[ip]) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    users[ip].lastLogin = new Date().toISOString();
    saveUsers(users);
    
    res.json({
        success: true,
        user: users[ip]
    });
});

// Função auxiliar para calcular impacto de mercado
function applyMarketImpact(stocks, symbol, quantity, isBuying) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) return stocks;
    
    // Calcula o impacto baseado no volume de compra/venda
    // Quanto maior a quantidade, maior o impacto
    const marketCap = stock.volume * stock.price; // Capitalização de mercado estimada
    const transactionValue = quantity * stock.price;
    const impactPercentage = (transactionValue / marketCap) * 100;
    
    // Limita o impacto entre 0.1% e 5%
    const limitedImpact = Math.min(Math.max(impactPercentage, 0.1), 5);
    
    // Aplica o impacto
    const priceChange = isBuying ? limitedImpact : -limitedImpact;
    const newPrice = Math.max(1, Math.round(stock.price * (1 + priceChange / 100)));
    
    // Atualiza o preço e registra a mudança
    stock.previousPrice = stock.price;
    stock.price = newPrice;
    stock.change = newPrice - stock.previousPrice;
    stock.changePercent = ((newPrice - stock.previousPrice) / stock.previousPrice) * 100;
    stock.high = Math.max(stock.high, newPrice);
    stock.low = Math.min(stock.low, newPrice);
    
    // Aumenta o volume também
    stock.volume += Math.floor(quantity * 100);
    
    return stocks;
}

// Comprar ações
app.post('/api/portfolio/buy', (req, res) => {
    const ip = getClientIP(req);
    const { symbol, quantity, price } = req.body;
    
    const users = loadUsers();
    const user = users[ip];
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    const totalCost = quantity * price;
    
    if (user.balance < totalCost) {
        return res.status(400).json({
            success: false,
            message: 'Saldo insuficiente'
        });
    }
    
    // Atualiza saldo
    user.balance -= totalCost;
    
    // Adiciona ao portfólio
    const existingStock = user.portfolio.find(s => s.symbol === symbol);
    
    if (existingStock) {
        const totalQuantity = existingStock.quantity + quantity;
        const totalInvested = existingStock.totalInvested + totalCost;
        existingStock.quantity = totalQuantity;
        existingStock.totalInvested = totalInvested;
        existingStock.avgPrice = totalInvested / totalQuantity;
    } else {
        user.portfolio.push({
            symbol,
            quantity,
            avgPrice: price,
            totalInvested: totalCost,
            purchasedAt: new Date().toISOString()
        });
    }
    
    // Adiciona transação
    user.transactions.unshift({
        type: 'buy',
        symbol,
        quantity,
        price,
        total: totalCost,
        timestamp: new Date().toISOString()
    });
    
    // Mantém apenas as últimas 50 transações
    if (user.transactions.length > 50) {
        user.transactions = user.transactions.slice(0, 50);
    }
    
    // 🔥 NOVO: Aplica impacto de mercado (compra aumenta o preço!)
    let stockData = loadStocks();
    if (stockData) {
        const stocks = stockData.stocks || stockData;
        const updatedStocks = applyMarketImpact(stocks, symbol, quantity, true);
        saveStocks(updatedStocks); // Mantém o lastUpdate original, não conta como atualização programada
    }
    
    saveUsers(users);
    
    res.json({
        success: true,
        user,
        message: `Compra realizada: ${quantity}x ${symbol}`
    });
});

// Vender ações
app.post('/api/portfolio/sell', (req, res) => {
    const ip = getClientIP(req);
    const { symbol, quantity, price } = req.body;
    
    const users = loadUsers();
    const user = users[ip];
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    const stock = user.portfolio.find(s => s.symbol === symbol);
    
    if (!stock || stock.quantity < quantity) {
        return res.status(400).json({
            success: false,
            message: 'Ações insuficientes'
        });
    }
    
    const totalRevenue = quantity * price;
    
    // Atualiza saldo
    user.balance += totalRevenue;
    
    // Atualiza portfólio
    stock.quantity -= quantity;
    stock.totalInvested -= (stock.avgPrice * quantity);
    
    if (stock.quantity === 0) {
        user.portfolio = user.portfolio.filter(s => s.symbol !== symbol);
    }
    
    // Adiciona transação
    user.transactions.unshift({
        type: 'sell',
        symbol,
        quantity,
        price,
        total: totalRevenue,
        timestamp: new Date().toISOString()
    });
    
    if (user.transactions.length > 50) {
        user.transactions = user.transactions.slice(0, 50);
    }
    
    // 🔥 NOVO: Aplica impacto de mercado (venda diminui o preço!)
    let stockData = loadStocks();
    if (stockData) {
        const stocks = stockData.stocks || stockData;
        const updatedStocks = applyMarketImpact(stocks, symbol, quantity, false);
        saveStocks(updatedStocks); // Mantém o lastUpdate original
    }
    
    saveUsers(users);
    
    res.json({
        success: true,
        user,
        message: `Venda realizada: ${quantity}x ${symbol}`
    });
});

// Depositar libras
app.post('/api/portfolio/deposit', (req, res) => {
    const ip = getClientIP(req);
    const { amount } = req.body;
    
    const users = loadUsers();
    const user = users[ip];
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    if (amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valor inválido'
        });
    }
    
    user.balance += amount;
    
    user.transactions.unshift({
        type: 'deposit',
        amount,
        timestamp: new Date().toISOString()
    });
    
    saveUsers(users);
    
    res.json({
        success: true,
        user,
        message: `Depósito realizado: ${amount} libras`
    });
});

// Obter ações sincronizadas
app.get('/api/stocks', (req, res) => {
    const stocks = loadStocks();
    res.json({
        success: true,
        stocks: stocks || []
    });
});

// Atualizar ações (chamado pelo sistema a cada 10min)
app.post('/api/stocks/update', (req, res) => {
    const { stocks } = req.body;
    saveStocks(stocks);
    
    res.json({
        success: true,
        message: 'Ações atualizadas'
    });
});

// Ranking de investidores
app.get('/api/ranking', (req, res) => {
    const users = loadUsers();
    const stocks = loadStocks();
    
    const ranking = Object.values(users).map(user => {
        let portfolioValue = 0;
        
        if (stocks && user.portfolio.length > 0) {
            user.portfolio.forEach(holding => {
                const stock = stocks.find(s => s.symbol === holding.symbol);
                if (stock) {
                    portfolioValue += holding.quantity * stock.price;
                }
            });
        }
        
        return {
            username: user.username,
            balance: user.balance,
            portfolioValue,
            totalWealth: user.balance + portfolioValue,
            stocksOwned: user.portfolio.length
        };
    }).sort((a, b) => b.totalWealth - a.totalWealth);
    
    res.json({
        success: true,
        ranking
    });
});

// 🔥 NOVO: Estatísticas de mercado (demanda por ação)
app.get('/api/market/stats', (req, res) => {
    const users = loadUsers();
    const stocks = loadStocks();
    
    if (!stocks || stocks.length === 0) {
        return res.json({ success: true, stats: [] });
    }
    
    // Calcula quantos investidores possuem cada ação
    const stockStats = stocks.map(stock => {
        let totalInvestors = 0;
        let totalQuantityHeld = 0;
        let totalInvested = 0;
        
        Object.values(users).forEach(user => {
            const holding = user.portfolio.find(h => h.symbol === stock.symbol);
            if (holding) {
                totalInvestors++;
                totalQuantityHeld += holding.quantity;
                totalInvested += holding.totalInvested;
            }
        });
        
        return {
            symbol: stock.symbol,
            name: stock.name,
            currentPrice: stock.price,
            investors: totalInvestors,
            quantityHeld: totalQuantityHeld,
            totalInvested: totalInvested,
            demand: totalInvestors > 0 ? 'high' : totalInvestors > 5 ? 'very-high' : 'low'
        };
    });
    
    res.json({
        success: true,
        stats: stockStats
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🏛️ Sunnyata Invests Server rodando na porta ${PORT}`);
    console.log(`📊 Acesse: http://localhost:${PORT}`);
});
