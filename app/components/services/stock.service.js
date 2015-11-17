angular
  .module('stockPortfolioApp')
  .factory('StockFactory', StockFactory);

function StockFactory($http) {
  var Stock = Parse.Object.extend("Stock");
  var Portfolio = Parse.Object.extend("Portfolio");
  var factory = {};
  return factory = {
    getStocks: function(portfolio) {
      var query = new Parse.Query(Stock);
      query.equalTo("portfolio", portfolio);
      return query.find().then(function(stocks) {
        console.log("Successfully retrieved " + stocks.length + " stocks.");
        var newPortfolio = {
          objectId: portfolio.id,
          title: portfolio.get("title"),
          stocks: []
        };
        for(var i = 0; i < stocks.length; i++) {
          var stock = stocks[i];
          var ticker = stock.get("ticker");
          var url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=" + ticker.toUpperCase() + "&callback=JSON_CALLBACK";
          $http({
            method: "jsonp",
            url: url,
            params: {ticker: ticker, stock: stock, i: i}
          }).then(function(response) {
            if(response.data.Status === undefined) {
              return;
            }
            var newStock = {
              ticker: response.config.params.ticker,
              objectId: response.config.params.stock.id,
              price: response.data.LastPrice,
              change: response.data.Change.toFixed(2)
            };
            newPortfolio.stocks.push(newStock);
          });
        }
        return newPortfolio;
      });
    },
    addStock: function(object, vmPortfolios) {
      if(isDuplicateTicker(ticker, object.portfolio)) {
        return;
      }

      var ticker = object.ticker;
      var url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=" + ticker.toUpperCase() + "&callback=JSON_CALLBACK";

      var addStockObject = {};
      return $http.jsonp(url).then(function(response) {
        if(response.data.Status === undefined) {
          return;
        }

        var query = new Parse.Query(Portfolio);
        addStockObject.response = response;
        return query.get(object.portfolio.objectId);
      }).then(function(portfolio) {
        // The object was retrieved successfully.
        var stock = new Stock();
        stock.set("ticker", ticker.toUpperCase());
        stock.set("portfolio", portfolio);
        addStockObject.portfolio = portfolio;
        return stock.save(null);
      }).then(function(stock) {
        var portfolio = addStockObject.portfolio;
        var response = addStockObject.response;

        console.log('New object created with objectId: ' + stock.id);
        var newStock = {
          ticker: stock.get("ticker"),
          objectId: stock.id,
          price: response.data.LastPrice,
          change: response.data.Change.toFixed(2),
          isDeleted: false
        };
        for(var i = 0; i < vmPortfolios.length; ++i) {
          if(portfolio.id == vmPortfolios[i].objectId) {
            vmPortfolios[i].stocks.push(newStock);
            return vmPortfolios;
          }
        }
      });
    },
    deleteStock: function(stock, vmPortfolios) {
      var deleteStock = new Stock();
      deleteStock.set("id", stock.stock.objectId);

      return deleteStock.destroy().then(function(stock) {
        console.log("deleted", stock);
        for(var i = 0; i < vmPortfolios.length; ++i) {
          for(var j = 0; j < vmPortfolios[i].stocks.length; ++j) {
            if(stock.id == vmPortfolios[i].stocks[j].objectId) {
              vmPortfolios[i].stocks.splice(j, 1);
              return vmPortfolios;
            }
          }
        }
      });
    }
  }
}
