angular
  .module('stockPortfolioApp')
  .directive('portfolio', PortfolioDirective);

function PortfolioDirective() {
  return {
    restrict: 'E', //makes the directive as an element only
    templateUrl: 'app/shared/portfolio/portfolio.directive.html',
    scope: {
      portfolio: "=",
      ticker: "=",
      deleteStock: "&",
      stockModal: "&",
      deletePortfolio: "&",
      addStock: "&"
    },
    link: function(scope) {
      scope.handleAddStock = function() {
        console.log(scope.ticker);
        scope.addStock({ticker: scope.ticker, portfolio: scope.portfolio});
        scope.ticker = "";
      },
      scope.handleDeletePortfolio = function() {
        scope.deletePortfolio({portfolio: scope.portfolio});
      }
    }
  };
}
