angular
  .module('stockPortfolioApp')
  .controller('DashboardController', DashboardController);

function DashboardController(SessionFactory, $scope, $http) {
  var vm = this;
  vm.user = Parse.User.current();
  vm.isNewPortfolio = false;
  vm.newPortfolioTitle = "";
  vm.portfolios = [];
  vm.logOut = logOut;
  vm.addStock = addStock;
  vm.showPortfolioInput = showPortfolioInput;
  vm.deleteStock = deleteStock;
  vm.newPortfolio = newPortfolio;

  var Stock = Parse.Object.extend("Stock");
  var Portfolio = Parse.Object.extend("Portfolio");


  function logOut() {
    SessionFactory.logOut();
  }
  getPortfolios();

  function getPortfolios() {
    var query = new Parse.Query(Portfolio);
    query.equalTo("user", vm.user);
    query.find({
      success: function(portfolios) {
        console.log("Successfully retrieved " + portfolios.length + " portfolios.");
        for (var i = 0; i < portfolios.length; i++) {
          getStocks(portfolios[i]);
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  function getStocks(portfolio) {
    var query = new Parse.Query(Stock);
    query.equalTo("portfolio", portfolio);
    query.find({
      success: function(stocks) {
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
            params: {ticker: ticker, stock: stock}
          }).then(function(response) {
            if(response.data.Status === undefined) {
              return;
            }
            var newStock = {
              ticker: response.config.params.ticker,
              objectId: response.config.params.stock.id,
              price: response.data.LastPrice,
              change: response.data.Change.toFixed(2),
              isDeleted: false
            };
            newPortfolio.stocks.push(newStock);
          });
        }
        vm.portfolios.push(newPortfolio);
        $scope.$apply();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  function addStock(object) {
    var ticker = object.ticker;
    var url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=" + ticker.toUpperCase() + "&callback=JSON_CALLBACK";

    if(isDuplicateTicker(ticker, object.portfolio)) {
      return;
    }

    return $http.jsonp(url).then(function(response) {
      if(response.data.Status === undefined) {
        return;
      }

      var query = new Parse.Query(Portfolio);
      query.get(object.portfolio.objectId, {
        success: function(portfolio) {
          // The object was retrieved successfully.
          var stock = new Stock();
          stock.set("ticker", ticker.toUpperCase());
          stock.set("portfolio", portfolio);
          stock.save(null, {
            success: function(stock) {
              console.log('New object created with objectId: ' + stock.id);
              var newStock = {
                ticker: stock.get("ticker"),
                objectId: stock.id,
                price: response.data.LastPrice,
                change: response.data.Change.toFixed(2),
                isDeleted: false
              };
              for(var i = 0; i < vm.portfolios.length; ++i) {
                if(portfolio.id == vm.portfolios[i].objectId) {
                  vm.portfolios[i].stocks.push(newStock);
                  break;
                }
              }
              $scope.$apply();
            },
            error: function(stock, error) {
              alert('Failed to create new object, with error code: ' + error.message);
            }
          });
        },
        error: function(portfolio, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
        }
      });
    });
  }

  function showPortfolioInput() {
    vm.isNewPortfolio = true;
  }

  function newPortfolio() {
    var portfolio = new Portfolio();

    portfolio.set("title", vm.newPortfolioTitle);
    portfolio.set("user", Parse.User.current());

    portfolio.save(null, {
      success: function(portfolio) {
        console.log('New object created with objectId: ' + portfolio.id);
        var newPortfolio = {
          objectId: portfolio.id,
          title: vm.newPortfolioTitle,
          stocks: []
        }
        vm.portfolios.push(newPortfolio);
        $scope.$apply();
      },
      error: function(portfolio, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
    vm.isNewPortfolio = false;
  }

  function deleteStock(stock) {
    var deleteStock = new Stock();

    deleteStock.set("id", stock.stock.objectId);

    deleteStock.destroy({
      success: function(stock) {
        console.log("deleted", stock);
      },
      error: function(myObject, error) {
        console.log("deleteFailed: ", stock);
      }
    });
  }
}

function isDuplicateTicker(ticker, portfolio) {
  for(var i = 0; i < portfolio.stocks.length; ++i) {
    if(ticker === portfolio.stocks[i].ticker) {
      console.log("can't insert duplicate stock");
      return true;
    }
  }
  return false;
}

/*var xxx = [];
var portfolio = {
  title: "tech stocks",
  stocks: [
    {
      ticker: "AAPL",
      price: 117.06,
      change: 0.35
    },
    {
      ticker: "MSFT",
      price: 54.36,
      change: -0.92
    }
  ]
};
xxx.push(portfolio);
portfolio = {
  title: "food stocks",
  stocks: [
    {
      ticker: "MCD",
      price: 3.07,
      change: 2.46
    },
    {
      ticker: "JACK",
      price: 798.31,
      change: -0.97
    }
  ]
};
xxx.push(portfolio);

console.log("xxx", xxx);*/
