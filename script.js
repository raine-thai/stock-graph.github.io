document.addEventListener("DOMContentLoaded", function() {
    var stockInput = document.getElementById("stockInput");
    var getStockDataButton = document.getElementById("getStockData");
    var stockInfo = document.getElementById("stockInfo");
    var stockChart = document.getElementById("stockChart").getContext("2d");
    var chartInstance;

    getStockDataButton.addEventListener("click", function() {
        var stockSymbol = stockInput.value.trim().toUpperCase();
        if (stockSymbol === "") {
            alert("Please enter a stock symbol.");
            return;
        }

        var apiKey = "AIZPZJ3Z7WL6XHRQ"; // Replace with your actual API key

        var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stockSymbol + "&apikey=" + apiKey;

        fetch(apiUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data["Time Series (Daily)"]) {
                    var dailyData = data["Time Series (Daily)"];
                    var stockDates = Object.keys(dailyData).reverse();
                    var stockPrices = stockDates.map(function(date) {
                        return parseFloat(dailyData[date]["4. close"]);
                    }).reverse();

                    var latestStockPrice = stockPrices[stockPrices.length - 1];

                    stockInfo.innerHTML = "<p>Current Price of " + stockSymbol + ": $" + latestStockPrice + "</p>";

                    // Chart data
                    if (chartInstance) {
                        chartInstance.destroy();
                    }

                    chartInstance = new Chart(stockChart, {
                        type: 'line',
                        data: {
                            labels: stockDates,
                            datasets: [{
                                label: 'Stock Price History',
                                data: stockPrices,
                                borderColor: 'blue',
                                fill: false
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    reverse: true // Reverse the x-axis
                                }
                            }
                        }
                    });
                } else {
                    throw new Error("Data not available for the given symbol.");
                }
            })
            .catch(function(error) {
                console.error("Error fetching stock data:", error);
                stockInfo.innerHTML = "An error occurred while fetching stock data.";
            });
    });
});
