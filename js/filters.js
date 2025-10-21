// Filtra e ordena as ações
export function filterAndSortStocks(stocks, countryFilter, sortBy) {
    let filtered = [...stocks];

    // Aplica filtro de país
    if (countryFilter !== 'all') {
        filtered = filtered.filter(stock => stock.country === countryFilter);
    }

    // Aplica ordenação
    switch (sortBy) {
        case 'change':
            filtered.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
            break;
        case 'price':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'volume':
            filtered.sort((a, b) => b.volume - a.volume);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    return filtered;
}

// Configura os event listeners dos filtros
export function setupFilters(onFilterChange) {
    const countryFilter = document.getElementById('countryFilter');
    const sortFilter = document.getElementById('sortFilter');

    countryFilter.addEventListener('change', () => {
        onFilterChange(countryFilter.value, sortFilter.value);
    });

    sortFilter.addEventListener('change', () => {
        onFilterChange(countryFilter.value, sortFilter.value);
    });
}
