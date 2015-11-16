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
          vmPortfolios.push(StockFactory.getStocks(portfolios[i]));
        }
        console.log("factory", vmPortfolios);
        return vmPortfolios; // TODO: issue is here.  It returns promises
      }).then(function(error) {
        alert("Error: " + error.code + " " + error.message);
      });
    },
    newPortfolio: function(vmPortfolios, vmNewPortfolioTitle) {
      if(portfolioExists(vmPortfolios, vmNewPortfolioTitle)) {
        return;
      }

      var portfolio = new Portfolio();

      portfolio.set("title", vmNewPortfolioTitle);
      portfolio.set("user", Parse.User.current());

      return portfolio.save(null).then(function(portfolio) {
        console.log('New object created with objectId: ' + portfolio.id);
        var newPortfolio = {
          objectId: portfolio.id,
          title: vmNewPortfolioTitle,
          isDeleted: false,
          stocks: []
        }
        return newPortfolio;
      }).then(function(portfolio, error) {
        alert('Failed to create new object, with error code: ' + error.message);
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
      }).then(function(error) {
        console.log("deleteFailed: ");
      });
    },
    portfolioExists: function(vmPortfolios, vmNewPortfolioTitle) {
      for(var i = 0; i < vmPortfolios.length; ++i) {
        if(vm.newPortfolioTitle === vmPortfolios[i].title) {
          return;
        }
      }
    }
  }
}
