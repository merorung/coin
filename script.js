async function getCryptoData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=krw&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('데이터를 가져오는데 실패했습니다:', error);
        return [];
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(num);
}

function updateTable(cryptoData) {
    const tableBody = document.getElementById('cryptoList');
    tableBody.innerHTML = '';

    cryptoData.forEach((coin, index) => {
        const row = document.createElement('tr');
        const priceChangeClass = coin.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="coin-name">
                <img src="${coin.image}" alt="${coin.name}" class="crypto-logo">
                ${coin.name}
            </td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>₩${formatNumber(coin.current_price)}</td>
            <td>₩${formatNumber(coin.market_cap)}</td>
            <td class="${priceChangeClass}">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

async function init() {
    const cryptoData = await getCryptoData();
    updateTable(cryptoData);
    
    // 1분마다 데이터 업데이트
    setInterval(async () => {
        const updatedData = await getCryptoData();
        updateTable(updatedData);
    }, 60000);
}

init(); 