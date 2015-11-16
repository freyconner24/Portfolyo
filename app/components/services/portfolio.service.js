angular
  .module('stockPortfolioApp')
  .factory('PortfolioFactory', PortfolioFactory);

function PortfolioFactory(StockFactory) {
  var Stock = Parse.Object.extend("Stock");
  var Portfolio = Parse.Object.extend("Portfolio");
  var currentUser = Parse.User.current();
  var factory = {};
  return factory = {
    getPortfolios: function() {
      var query = new Parse.Query(Portfolio);
      query.equalTo("user", currentUser);
      return query.find().then(function(portfolios) {
        var vmPortfolios = [];
        console.log("Successfully retrieved " + portfolios.length + " portfolios.");
        for (var i = 0; i < portfolios.length; i++) {
          vmPortfolios.push(StockFactory.getStocks(portfolios[i]));
        }
        console.log("factory", vmPortfolios);
        return vmPortfolios; // TODO: issue is here.  It returns promises
      }).then(function(error) {
        alert("Error: " + error.code + " " + error.message);
      });
    },
    newPortfolio: function(vm) {
      if(factory.portfolioExists(vm.portfolios, vm.newPortfolioTitle)) {
        return;
      }

      var portfolio = new Portfolio();

      portfolio.set("title", vm.newPortfolioTitle);
      portfolio.set("user", currentUser);

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
      console.log("delete portfolio", portfolio.portfolio);
      var deletePortfolio = new Portfolio();
      deletePortfolio.set("id", portfolio.portfolio.objectId);

      return deletePortfolio.destroy().then(function(portfolio) {
        console.log("deleted", portfolio);
        for(var i = 0; i < vmPortfolios.length; ++i) {
          if(vmPortfolios[i].objectId == portfolio.id) {
            vmPortfolios.splice(i, 1);
            console.log("found");
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
        if(vm.newPortfolioTitle === vmPortfolios[i].title) {
          return;
        }
      }
    }
  }
}
