import { COUNTRIES } from './config.js';

// Renderiza um card de ação
export function renderStockCard(stock, onBuyClick, marketStats = null) {
    const changeClass = stock.change > 0 ? 'positive' : stock.change < 0 ? 'negative' : 'neutral';
    const arrow = stock.change > 0 ? '↑' : stock.change < 0 ? '↓' : '→';
    
    // Busca estatísticas de demanda para esta ação
    let demandBadge = '';
    if (marketStats) {
        const stats = marketStats.find(s => s.symbol === stock.symbol);
        if (stats && stats.investors > 0) {
            const demandClass = stats.investors >= 5 ? 'very-high' : stats.investors >= 3 ? 'high' : 'medium';
            const demandIcon = stats.investors >= 5 ? '🔥' : stats.investors >= 3 ? '📈' : '👥';
            demandBadge = `
                <div class="demand-badge ${demandClass}">
                    ${demandIcon} ${stats.investors} investidor${stats.investors > 1 ? 'es' : ''}
                </div>
            `;
        }
    }
    
    return `
        <div class="stock-card ${changeClass}" data-country="${stock.country}" data-sector="${stock.sector}">
            <div class="stock-header">
                <div class="stock-info">
                    <h3>${stock.icon} ${stock.name}</h3>
                    <span class="stock-country">${stock.country}</span>
                    ${demandBadge}
                </div>
                <div class="stock-symbol">${stock.symbol}</div>
            </div>
            
            <div class="stock-price">${formatPrice(stock.price)} ⚜️</div>
            
            <div class="stock-change ${changeClass}">
                <span class="arrow">${arrow}</span>
                <span>${formatChange(stock.change)} (${formatPercent(stock.changePercent)})</span>
            </div>
            
            <div class="stock-details">
                <div class="detail-item">
                    <span class="detail-label">Volume</span>
                    <span class="detail-value">${formatVolume(stock.volume)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Setor</span>
                    <span class="detail-value">${stock.sector}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Máxima</span>
                    <span class="detail-value">${formatPrice(stock.high)} ⚜️</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Mínima</span>
                    <span class="detail-value">${formatPrice(stock.low)} ⚜️</span>
                </div>
            </div>
            
            <button class="btn-buy" data-symbol="${stock.symbol}" data-price="${stock.price}">
                💰 Comprar
            </button>
        </div>
    `;
}

// Renderiza todas as ações
export function renderStocks(stocks, container, onBuyClick, marketStats = null) {
    container.innerHTML = stocks.map(stock => renderStockCard(stock, onBuyClick, marketStats)).join('');
    
    // Adiciona listeners aos botões de compra
    if (onBuyClick) {
        container.querySelectorAll('.btn-buy').forEach(btn => {
            btn.onclick = () => {
                const symbol = btn.dataset.symbol;
                const price = parseFloat(btn.dataset.price);
                onBuyClick(symbol, price);
            };
        });
    }
}

// Atualiza as estatísticas do mercado
export function updateMarketStats(stocks) {
    const totalCompanies = stocks.length;
    const companiesUp = stocks.filter(s => s.change > 0).length;
    const companiesDown = stocks.filter(s => s.change < 0).length;
    const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);

    document.getElementById('totalCompanies').textContent = totalCompanies;
    document.getElementById('totalVolume').textContent = formatVolume(totalVolume);
    document.getElementById('companiesUp').textContent = companiesUp;
    document.getElementById('companiesDown').textContent = companiesDown;
}

// Atualiza informações de tempo
export function updateTimeInfo(lastUpdate, nextUpdateTime) {
    const lastUpdateEl = document.getElementById('lastUpdate');
    const nextUpdateEl = document.getElementById('nextUpdate');

    if (lastUpdate && lastUpdateEl) {
        const now = new Date();
        const diffMs = now - lastUpdate;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffSeconds = Math.floor((diffMs % 60000) / 1000);
        
        if (diffMinutes > 0) {
            lastUpdateEl.textContent = `Última atualização: há ${diffMinutes} min e ${diffSeconds} seg`;
        } else {
            lastUpdateEl.textContent = `Última atualização: há ${diffSeconds} segundos`;
        }
    }

    if (nextUpdateTime && nextUpdateEl) {
        const now = new Date();
        const diff = Math.max(0, nextUpdateTime - now);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        nextUpdateEl.textContent = `Próxima atualização em: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Popula o filtro de países
export function populateCountryFilter() {
    const select = document.getElementById('countryFilter');
    COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
    });
}

// Formata preço
function formatPrice(price) {
    return price.toLocaleString('pt-BR');
}

// Formata mudança de preço
function formatChange(change) {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
}

// Formata porcentagem
function formatPercent(percent) {
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
}

// Formata volume
function formatVolume(volume) {
    if (volume >= 1000000) {
        return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
        return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
}

// Formata hora
function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}
