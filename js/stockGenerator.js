import { COUNTRIES, SECTORS } from './config.js';

// Gera empresas para cada país
export function generateCompanies() {
    const companies = [];
    let id = 1;

    COUNTRIES.forEach(country => {
        // Cada país terá 3-5 empresas aleatórias
        const numCompanies = Math.floor(Math.random() * 3) + 3;
        const usedSectors = new Set();

        for (let i = 0; i < numCompanies; i++) {
            // Escolhe um setor que ainda não foi usado para este país
            let sector;
            do {
                sector = SECTORS[Math.floor(Math.random() * SECTORS.length)];
            } while (usedSectors.has(sector.name) && usedSectors.size < SECTORS.length);
            
            usedSectors.add(sector.name);

            const companyType = sector.companies[Math.floor(Math.random() * sector.companies.length)];
            const companyName = `${companyType} ${getCountryPrefix(country)}`;
            const symbol = generateSymbol(country, companyType);
            const basePrice = generateBasePrice();

            companies.push({
                id: id++,
                name: companyName,
                symbol: symbol,
                country: country,
                sector: sector.name,
                icon: sector.icon,
                price: basePrice,
                previousPrice: basePrice,
                change: 0,
                changePercent: 0,
                volume: generateVolume(),
                high: basePrice,
                low: basePrice,
            });
        }
    });

    return companies;
}

// Gera um prefixo baseado no nome do país
function getCountryPrefix(country) {
    const prefixes = {
        'Império Forger': 'Imperial',
        'Ostrakis': 'de Ostrakis',
        'Casa Ars': 'Ars',
        'Casa Eris': 'Eris',
        'Filhos da Terra': 'Terrestres',
        'Casa Monaco': 'Monaco',
        'Eroques': 'Eroqueanas',
        'Luarias': 'Luarianas',
        'Astellanos': 'Astellanas',
        'Slovanos': 'Slovanas',
        'Tuscos': 'Tuscanas',
        'Casa Venian': 'Venian'
    };
    return prefixes[country] || country;
}

// Gera um símbolo de ação (ticker)
function generateSymbol(country, companyType) {
    const countryCode = country.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const typeCode = companyType.substring(0, 2).toUpperCase().replace(/\s/g, '');
    return `${countryCode}${typeCode}`;
}

// Gera um preço base aleatório
function generateBasePrice() {
    // Preços entre 10 e 1000 moedas de ouro
    return Math.floor(Math.random() * 990) + 10;
}

// Gera volume de negociação
function generateVolume() {
    return Math.floor(Math.random() * 900000) + 100000;
}

// Atualiza os preços das empresas com variação aleatória
export function updateStockPrices(companies) {
    return companies.map(company => {
        const previousPrice = company.price;
        
        // Variação de -8% a +8%
        const changePercent = (Math.random() * 16) - 8;
        const change = previousPrice * (changePercent / 100);
        const newPrice = Math.max(1, Math.round(previousPrice + change));

        // Atualiza máxima e mínima
        const high = Math.max(company.high, newPrice);
        const low = Math.min(company.low, newPrice);

        // Varia o volume também
        const volumeChange = (Math.random() * 0.4) - 0.2; // -20% a +20%
        const newVolume = Math.floor(company.volume * (1 + volumeChange));

        return {
            ...company,
            previousPrice,
            price: newPrice,
            change: newPrice - previousPrice,
            changePercent: ((newPrice - previousPrice) / previousPrice) * 100,
            volume: Math.max(10000, newVolume),
            high,
            low,
        };
    });
}
