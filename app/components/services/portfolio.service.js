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
        var vmPortfolios = [];
        console.log("Successfully retrieved " + portfolios.length + " portfolios.");
        for (var i = 0; i < portfolios.length; i++) {
          StockFactory.getStocks(portfolios[i]).then(function(portfolio) {
            vmPortfolios.push(portfolio);
          });
        }
        return vmPortfolios; // TODO: issue is here.  It returns promises
      });
    },
    newPortfolio: function(vm) {
      if(factory.portfolioExists(vm.portfolios, vm.newPortfolioTitle)) {
        return;
      }

      var portfolio = new Portfolio();

      portfolio.set("title", vm.newPortfolioTitle);
      portfolio.set("user", Parse.User.current());

      return portfolio.save(null).then(function(portfolio) {
        console.log('New object created with objectId: ' + portfolio.id);
        var newPortfolio = {
          objectId: portfolio.id,
          title: vm.newPortfolioTitle,
          isDeleted: false,
          stocks: []
        }
        return newPortfolio;
      });
    },
    deletePortfolio: function(portfolio, vmPortfolios) {
      var deletePortfolio = new Portfolio();
      deletePortfolio.set("id", portfolio.portfolio.objectId);

      return deletePortfolio.destroy().then(function(portfolio) {
        console.log("deleted", portfolio);
        for(var i = 0; i < vmPortfolios.length; ++i) {
          if(vmPortfolios[i].objectId == portfolio.id) {
            vmPortfolios.splice(i, 1);
            return vmPortfolios;
          }
        }
      });
    },
    portfolioExists: function(vmPortfolios, vmNewPortfolioTitle) {
      if(vmPortfolios === undefined || vmNewPortfolioTitle === undefined) {
        return false;
      }

      for(var i = 0; i < vmPortfolios.length; ++i) {
        if(vmNewPortfolioTitle === vmPortfolios[i].title) {
          return;
        }
      }
    }
  }
}
