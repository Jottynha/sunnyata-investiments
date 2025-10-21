import API from './api.js';

// Renderiza o modal de login
export function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>🏛️ Bem-vindo ao Sunnyata Invests</h2>
            <p>Entre com seu nome ou deixe em branco para gerar automaticamente</p>
            <input type="text" id="usernameInput" placeholder="Nome do investidor (opcional)" maxlength="20">
            <button id="loginBtn" class="btn-primary">Entrar</button>
            <p class="info-text">Seu perfil é único por IP</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = document.getElementById('usernameInput');
    const btn = document.getElementById('loginBtn');
    
    input.focus();
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btn.click();
        }
    });
    
    return new Promise((resolve) => {
        btn.addEventListener('click', async () => {
            const username = input.value.trim();
            btn.disabled = true;
            btn.textContent = 'Entrando...';
            
            const result = await API.login(username);
            
            if (result.success) {
                modal.remove();
                resolve(result.user);
            } else {
                alert(result.message);
                btn.disabled = false;
                btn.textContent = 'Entrar';
            }
        });
    });
}

// Renderiza o painel do usuário
export function renderUserPanel(user, stocks) {
    let portfolioValue = 0;
    let totalProfit = 0;
    
    if (user.portfolio.length > 0) {
        user.portfolio.forEach(holding => {
            const stock = stocks.find(s => s.symbol === holding.symbol);
            if (stock) {
                const currentValue = holding.quantity * stock.price;
                portfolioValue += currentValue;
                totalProfit += currentValue - holding.totalInvested;
            }
        });
    }
    
    const totalWealth = user.balance + portfolioValue;
    const profitPercent = user.portfolio.length > 0 
        ? (totalProfit / (totalWealth - totalProfit)) * 100 
        : 0;
    
    const profitClass = totalProfit > 0 ? 'positive' : totalProfit < 0 ? 'negative' : 'neutral';
    
    return `
        <div class="user-panel">
            <div class="user-header">
                <div class="user-info">
                    <h2>👤 ${user.username}</h2>
                    <span class="user-ip">IP: ${user.ip.substring(0, 15)}...</span>
                </div>
                <button id="depositBtn" class="btn-deposit">💰 Depositar</button>
            </div>
            
            <div class="wealth-overview">
                <div class="wealth-card">
                    <span class="wealth-label">Saldo em Libras</span>
                    <span class="wealth-value">${formatCurrency(user.balance)} ⚜️</span>
                </div>
                <div class="wealth-card">
                    <span class="wealth-label">Valor em Ações</span>
                    <span class="wealth-value">${formatCurrency(portfolioValue)} ⚜️</span>
                </div>
                <div class="wealth-card highlight">
                    <span class="wealth-label">Patrimônio Total</span>
                    <span class="wealth-value">${formatCurrency(totalWealth)} ⚜️</span>
                </div>
                <div class="wealth-card ${profitClass}">
                    <span class="wealth-label">Lucro/Prejuízo</span>
                    <span class="wealth-value">${formatChange(totalProfit)} ⚜️ (${formatPercent(profitPercent)})</span>
                </div>
            </div>
            
            ${renderPortfolio(user.portfolio, stocks)}
            ${renderTransactionHistory(user.transactions)}
        </div>
    `;
}

// Renderiza o portfólio
function renderPortfolio(portfolio, stocks) {
    if (portfolio.length === 0) {
        return `
            <div class="portfolio-section">
                <h3>📊 Meu Portfólio</h3>
                <p class="empty-message">Você ainda não possui ações. Comece investindo!</p>
            </div>
        `;
    }
    
    const holdings = portfolio.map(holding => {
        const stock = stocks.find(s => s.symbol === holding.symbol);
        if (!stock) return '';
        
        const currentValue = holding.quantity * stock.price;
        const profit = currentValue - holding.totalInvested;
        const profitPercent = (profit / holding.totalInvested) * 100;
        const profitClass = profit > 0 ? 'positive' : profit < 0 ? 'negative' : 'neutral';
        
        return `
            <div class="portfolio-item ${profitClass}">
                <div class="portfolio-header">
                    <div>
                        <h4>${stock.icon} ${stock.name}</h4>
                        <span class="portfolio-symbol">${stock.symbol}</span>
                    </div>
                    <button class="btn-sell" data-symbol="${stock.symbol}" data-price="${stock.price}">
                        Vender
                    </button>
                </div>
                <div class="portfolio-details">
                    <div class="detail-row">
                        <span>Quantidade:</span>
                        <strong>${holding.quantity}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Preço Médio:</span>
                        <strong>${formatCurrency(holding.avgPrice)} ⚜️</strong>
                    </div>
                    <div class="detail-row">
                        <span>Preço Atual:</span>
                        <strong>${formatCurrency(stock.price)} ⚜️</strong>
                    </div>
                    <div class="detail-row">
                        <span>Investido:</span>
                        <strong>${formatCurrency(holding.totalInvested)} ⚜️</strong>
                    </div>
                    <div class="detail-row">
                        <span>Valor Atual:</span>
                        <strong>${formatCurrency(currentValue)} ⚜️</strong>
                    </div>
                    <div class="detail-row ${profitClass}">
                        <span>Lucro/Prejuízo:</span>
                        <strong>${formatChange(profit)} ⚜️ (${formatPercent(profitPercent)})</strong>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="portfolio-section">
            <h3>📊 Meu Portfólio</h3>
            <div class="portfolio-grid">
                ${holdings}
            </div>
        </div>
    `;
}

// Renderiza histórico de transações
function renderTransactionHistory(transactions) {
    if (transactions.length === 0) {
        return '';
    }
    
    const items = transactions.slice(0, 10).map(tx => {
        let icon, text, className;
        
        if (tx.type === 'buy') {
            icon = '📈';
            text = `Compra: ${tx.quantity}x ${tx.symbol} @ ${formatCurrency(tx.price)} ⚜️`;
            className = 'buy';
        } else if (tx.type === 'sell') {
            icon = '📉';
            text = `Venda: ${tx.quantity}x ${tx.symbol} @ ${formatCurrency(tx.price)} ⚜️`;
            className = 'sell';
        } else {
            icon = '💰';
            text = `Depósito: ${formatCurrency(tx.amount)} ⚜️`;
            className = 'deposit';
        }
        
        const date = new Date(tx.timestamp);
        const timeStr = date.toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <div class="transaction-item ${className}">
                <span class="tx-icon">${icon}</span>
                <span class="tx-text">${text}</span>
                <span class="tx-time">${timeStr}</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="transactions-section">
            <h3>📜 Últimas Transações</h3>
            <div class="transactions-list">
                ${items}
            </div>
        </div>
    `;
}

// Modal de depósito
export function showDepositModal(onDeposit) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>💰 Depositar Libras</h2>
            <p>Quanto você deseja depositar?</p>
            <input type="number" id="depositAmount" placeholder="Quantidade" min="1" step="1">
            <div class="modal-buttons">
                <button id="depositConfirm" class="btn-primary">Depositar</button>
                <button id="depositCancel" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = document.getElementById('depositAmount');
    const confirmBtn = document.getElementById('depositConfirm');
    const cancelBtn = document.getElementById('depositCancel');
    
    input.focus();
    
    cancelBtn.onclick = () => modal.remove();
    
    confirmBtn.onclick = async () => {
        const amount = parseInt(input.value);
        if (!amount || amount <= 0) {
            alert('Valor inválido');
            return;
        }
        
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processando...';
        
        await onDeposit(amount);
        modal.remove();
    };
}

// Modal de compra
export function showBuyModal(stock, onBuy) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>📈 Comprar ${stock.icon} ${stock.name}</h2>
            <p>Preço atual: ${formatCurrency(stock.price)} ⚜️</p>
            <input type="number" id="buyQuantity" placeholder="Quantidade" min="1" step="1">
            <p id="totalCost">Total: 0 ⚜️</p>
            <div class="modal-buttons">
                <button id="buyConfirm" class="btn-primary">Comprar</button>
                <button id="buyCancel" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = document.getElementById('buyQuantity');
    const totalCost = document.getElementById('totalCost');
    const confirmBtn = document.getElementById('buyConfirm');
    const cancelBtn = document.getElementById('buyCancel');
    
    input.focus();
    
    input.oninput = () => {
        const qty = parseInt(input.value) || 0;
        totalCost.textContent = `Total: ${formatCurrency(qty * stock.price)} ⚜️`;
    };
    
    cancelBtn.onclick = () => modal.remove();
    
    confirmBtn.onclick = async () => {
        const quantity = parseInt(input.value);
        if (!quantity || quantity <= 0) {
            alert('Quantidade inválida');
            return;
        }
        
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processando...';
        
        await onBuy(quantity);
        modal.remove();
    };
}

// Modal de venda
export function showSellModal(stock, holding, onSell) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>📉 Vender ${stock.icon} ${stock.name}</h2>
            <p>Você possui: ${holding.quantity} ações</p>
            <p>Preço atual: ${formatCurrency(stock.price)} ⚜️</p>
            <input type="number" id="sellQuantity" placeholder="Quantidade" min="1" max="${holding.quantity}" step="1">
            <p id="totalRevenue">Total: 0 ⚜️</p>
            <div class="modal-buttons">
                <button id="sellConfirm" class="btn-primary">Vender</button>
                <button id="sellCancel" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = document.getElementById('sellQuantity');
    const totalRevenue = document.getElementById('totalRevenue');
    const confirmBtn = document.getElementById('sellConfirm');
    const cancelBtn = document.getElementById('sellCancel');
    
    input.focus();
    
    input.oninput = () => {
        const qty = parseInt(input.value) || 0;
        totalRevenue.textContent = `Total: ${formatCurrency(qty * stock.price)} ⚜️`;
    };
    
    cancelBtn.onclick = () => modal.remove();
    
    confirmBtn.onclick = async () => {
        const quantity = parseInt(input.value);
        if (!quantity || quantity <= 0 || quantity > holding.quantity) {
            alert('Quantidade inválida');
            return;
        }
        
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processando...';
        
        await onSell(quantity);
        modal.remove();
    };
}

// Funções auxiliares de formatação
function formatCurrency(value) {
    return Math.round(value).toLocaleString('pt-BR');
}

function formatChange(value) {
    const sign = value > 0 ? '+' : '';
    return `${sign}${Math.round(value).toLocaleString('pt-BR')}`;
}

function formatPercent(value) {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}
