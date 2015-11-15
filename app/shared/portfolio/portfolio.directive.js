angular
  .module('stockPortfolioApp')
  .directive('portfolio', PortfolioDirective);

function PortfolioDirective() {
  return {
    restrict: 'E', //makes the directive as an element only
    templateUrl: 'app/shared/portfolio/portfolio.directive.html',
    scope: {
      portfolio: "=portfolio",
      ticker: "=ticker",
      addStockToPortfolio: "&click"
    },
    link: function(scope) {
      scope.handleAddStockToPortfolio = function() {
        console.log(scope.ticker);
        scope.addStockToPortfolio({ticker: scope.ticker, portfolio: scope.portfolio});
        scope.ticker = "";
      }
    }
  };
}
