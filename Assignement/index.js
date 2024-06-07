const fs = require('fs');

function readData(filePath) {
    const salesData = [];
    const fileContents = fs.readFileSync(filePath, 'utf-8').split('\n').slice(1); // Skip header
    fileContents.forEach(line => {
        const [date, item, quantity, price] = line.trim().split(',');
        salesData.push({
            date: date,
            item: item,
            quantity: parseInt(quantity),
            price: parseFloat(price)
        });
    });
    return salesData;
}

function totalSales(salesData) {
    return salesData.reduce((total, sale) => total + sale.price, 0);
}

function monthWiseSalesTotals(salesData) {
    const monthTotals = {};
    salesData.forEach(sale => {
        const month = sale.date.split('-')[1];
        monthTotals[month] = (monthTotals[month] || 0) + sale.price;
    });
    return monthTotals;
}

function mostPopularItemPerMonth(salesData) {
    const popularItems = {};
    salesData.forEach(sale => {
        const month = sale.date.split('-')[1];
        if (!popularItems[month] || popularItems[month].quantity < sale.quantity) {
            popularItems[month] = { item: sale.item, quantity: sale.quantity };
        }
    });
    return popularItems;
}

function itemsGeneratingMostRevenuePerMonth(salesData) {
    const revenueItems = {};
    salesData.forEach(sale => {
        const month = sale.date.split('-')[1];
        if (!revenueItems[month] || revenueItems[month].revenue < sale.price) {
            revenueItems[month] = { item: sale.item, revenue: sale.price };
        }
    });
    return revenueItems;
}

function minMaxAvgOrdersMostPopularItem(salesData) {
    const itemSales = {};
    salesData.forEach(sale => {
        const item = sale.item;
        if (!itemSales[item]) {
            itemSales[item] = { min: sale.quantity, max: sale.quantity, total: sale.quantity, count: 1 };
        } else {
            itemSales[item].min = Math.min(itemSales[item].min, sale.quantity);
            itemSales[item].max = Math.max(itemSales[item].max, sale.quantity);
            itemSales[item].total += sale.quantity;
            itemSales[item].count++;
        }
    });
    for (const item in itemSales) {
        itemSales[item].avg = itemSales[item].total / itemSales[item].count;
    }
    return itemSales;
}

function main() {
    const filePath = 'sales_data.csv';
    const salesData = readData(filePath);

    console.log("Total Sales of the Store:", totalSales(salesData));

    console.log("\nMonth-wise Sales Totals:");
    const monthTotals = monthWiseSalesTotals(salesData);
    for (const month in monthTotals) {
        console.log("Month:", month, "| Total Sales:", monthTotals[month]);
    }

    console.log("\nMost Popular Item per Month:");
    const popularItems = mostPopularItemPerMonth(salesData);
    for (const month in popularItems) {
        console.log("Month:", month, "| Most Popular Item:", popularItems[month].item, "| Quantity Sold:", popularItems[month].quantity);
    }

    console.log("\nItems Generating Most Revenue per Month:");
    const revenueItems = itemsGeneratingMostRevenuePerMonth(salesData);
    for (const month in revenueItems) {
        console.log("Month:", month, "| Highest Revenue Item:", revenueItems[month].item, "| Revenue Generated:", revenueItems[month].revenue);
    }

    console.log("\nMin, Max, and Average Orders for Most Popular Item per Month:");
    const popularItemStats = minMaxAvgOrdersMostPopularItem(salesData);
    for (const item in popularItemStats) {
        console.log("Item:", item, "| Min Orders:", popularItemStats[item].min, "| Max Orders:", popularItemStats[item].max, "| Average Orders:", popularItemStats[item].avg);
    }
}

main();
