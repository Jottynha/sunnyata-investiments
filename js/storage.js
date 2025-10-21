import { CONFIG } from './config.js';

// Salva dados no localStorage
export function saveData(data) {
    try {
        const dataToSave = {
            companies: data,
            lastUpdate: new Date().toISOString(),
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}

// Carrega dados do localStorage
export function loadData() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            return {
                companies: data.companies,
                lastUpdate: new Date(data.lastUpdate),
            };
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
    return null;
}

// Verifica se os dados precisam ser atualizados
export function needsUpdate() {
    const data = loadData();
    if (!data) return true;

    const now = new Date();
    const timeSinceUpdate = now - data.lastUpdate;
    
    return timeSinceUpdate >= CONFIG.UPDATE_INTERVAL;
}
