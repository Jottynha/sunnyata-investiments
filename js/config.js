// Configurações do sistema
export const CONFIG = {
    UPDATE_INTERVAL: 10 * 60 * 1000, // 10 minutos em milissegundos
    STORAGE_KEY: 'sunnyata_stocks_data',
    ANIMATION_DURATION: 300,
};

// Nações do RPG
export const COUNTRIES = [
    'Império Forger',
    'Ostrakis',
    'Casa Ars',
    'Casa Eris',
    'Filhos da Terra',
    'Casa Monaco',
    'Eroques',
    'Luarias',
    'Astellanos',
    'Slovanos',
    'Tuscos',
    'Casa Venian'
];

// Setores econômicos para gerar empresas
export const SECTORS = [
    { name: 'Mineração', icon: '⛏️', companies: ['Minas', 'Metais', 'Gemas', 'Ferro'] },
    { name: 'Comércio', icon: '🏪', companies: ['Mercadores', 'Caravanas', 'Negócios', 'Empório'] },
    { name: 'Agricultura', icon: '🌾', companies: ['Fazendas', 'Grãos', 'Colheitas', 'Terras'] },
    { name: 'Manufatura', icon: '⚙️', companies: ['Forjas', 'Fábricas', 'Artesãos', 'Oficinas'] },
    { name: 'Magia', icon: '✨', companies: ['Arcanos', 'Místicos', 'Encantamentos', 'Runas'] },
    { name: 'Transporte', icon: '🚢', companies: ['Navios', 'Rotas', 'Viagens', 'Transportes'] },
    { name: 'Construção', icon: '🏗️', companies: ['Construtora', 'Arquitetura', 'Engenharia', 'Obras'] },
    { name: 'Alquimia', icon: '🧪', companies: ['Poções', 'Elixires', 'Alquimistas', 'Laboratórios'] }
];

// Volatilidade do mercado (quanto os preços podem variar)
export const MARKET_VOLATILITY = {
    MIN: -8,  // -8%
    MAX: 8    // +8%
};
