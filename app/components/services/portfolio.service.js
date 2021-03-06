angular
  .module('stockPortfolioApp')
  .factory('PortfolioFactory', PortfolioFactory);

function PortfolioFactory(StockFactory) {
  var Stock = Parse.Object.extend("Stock");
  var Portfolio = Parse.Object.extend("Portfolio");
  var factory = {};
  return factory = {
    getPortfolios: function() {
      var query = new Parse.Query(Portfolio);
      query.equalTo("user", Parse.User.current());
      return query.find().then(function(portfolios) {
        console.log("Successfully retrieved " + portfolios.length + " portfolios.");
        var vmPortfolios = factory.populatePortfoliosWithStocks(portfolios);
        return vmPortfolios;
      });
    },
    addPortfolio: function(vm) {
      if(factory.portfolioExists(vm.portfolios, vm.newPortfolioTitle)) {
        return false;
      }

      var portfolio = new Portfolio();

      portfolio.set("title", vm.newPortfolioTitle);
      portfolio.set("user", Parse.User.current());

      return portfolio.save(null).then(function(portfolio) {
        console.log('New object created with objectId: ' + portfolio.id);
        return factory.constructPortfolioObject(portfolio.id, vm.newPortfolioTitle, portfolio.get("createdAt"), []);
      });
    },
    deletePortfolio: function(portfolio, vmPortfolios) {
      var deletePortfolio = new Portfolio();
      deletePortfolio.set("id", portfolio.portfolio.objectId);

      return deletePortfolio.destroy().then(function(portfolio) {
        console.log("deleted", portfolio);
        for(var i = 0; i < vmPortfolios.length; ++i) {
          if(vmPortfolios[i].objectId == portfolio.id) {
            console.log(vmPortfolios);
            var stocks = vmPortfolios[i].stocks;
            factory.deleteStocks(stocks);
            vmPortfolios.splice(i, 1);
          }
        }
      }).done(function() {
        return vmPortfolios;
      });
    },
    constructPortfolioObject: function(objectId, title, createdAt, stocks) {
      return {
        objectId: objectId,
        title: title,
        createdAt: createdAt,
        stocks: stocks
      }
    },
    populatePortfoliosWithStocks: function(portfolios){
      var vmPortfolios = [];
      for (var i = 0; i < portfolios.length; i++) {
        StockFactory.getStocks(portfolios[i]).then(function(portfolio) {
          vmPortfolios.push(portfolio);
        });
      }
      return vmPortfolios;
    },
    portfolioExists: function(vmPortfolios, vmNewPortfolioTitle) {
      if(vmPortfolios === undefined || vmNewPortfolioTitle === undefined) {
        return false;
      }

      for(var i = 0; i < vmPortfolios.length; ++i) {
        if(vmNewPortfolioTitle === vmPortfolios[i].title) {
          return true;
        }
      }

      return false;
    },
    deleteStocks: function(stocks) {
      var deleteStock = new Stock();
      for(var i = 0; i < stocks.length; ++i) {
        deleteStock.set("id", stocks[i].objectId);
        deleteStock.destroy();
      }

      stocks = [];
      return stocks;
    }
  }
}
