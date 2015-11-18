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
        var newPortfolio = factory.constructPortfolioObject(portfolio.id, portfolio.get("title"), portfolio.get("createdAt"), []);
        for(var i = 0; i < stocks.length; i++) {
          var stock = stocks[i];
          var ticker = stock.get("ticker");
          var url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=" + ticker.toUpperCase() + "&callback=JSON_CALLBACK";
          $http({
            method: "jsonp",
            url: url,
            params: {ticker: ticker, stock: stock}
          }).then(function(response) {
            if(response.data.Status === undefined) {
              return;
            }
            var newStock = factory.constructStockObject(response.config.params.stock.id, response.config.params.ticker, response.data.LastPrice, response.data.Change.toFixed(2));
            newPortfolio.stocks.push(newStock);
          });
        }
        return newPortfolio;
      });
    },
    addStock: function(object, vmPortfolios) {
      var ticker = object.ticker;
      var portfolio = object.portfolio;
      if(factory.stockExists(ticker, portfolio)) {
        return;
      }
      var url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=" + ticker.toUpperCase() + "&callback=JSON_CALLBACK";

      var addStockObject = {};
      return $http.jsonp(url).then(function(response, error) {
        if(response.data.Status === undefined) {
          console.log("dones't exist");
          return {};
        }

        var query = new Parse.Query(Portfolio);
        addStockObject.response = response;
        return query.get(portfolio.objectId);
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
        var newStock = factory.constructStockObject(stock.id, stock.get("ticker"), response.data.LastPrice, response.data.Change.toFixed(2));
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
    },
    constructStockObject: function(objectId, ticker, price, change) {
      return {
        objectId: objectId,
        ticker: ticker,
        price: price,
        change: change
      }
    },
    constructPortfolioObject: function(objectId, title, createdAt, stocks) {
      return {
        objectId: objectId,
        title: title,
        createdAt: createdAt,
        stocks: stocks
      }
    },
    stockExists: function(ticker, portfolio) {
      for(var i = 0; i < portfolio.stocks.length; ++i) {
        if(ticker === portfolio.stocks[i].ticker) {
          console.log("can't insert duplicate stock");
          return true;
        }
      }
      return false;
    }
  }
}
