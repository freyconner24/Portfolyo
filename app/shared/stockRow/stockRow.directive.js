angular
  .module('stockPortfolioApp')
  .directive('stockRow', StockRowDirective);

function StockRowDirective() {
  return {
    restrict: 'E', //makes the directive as an element only
    templateUrl: 'app/shared/stockRow/stockRow.directive.html',
    scope: {
      stock: "=stock",
      deleteStock: "&deleteStock"
    },
    link: function(scope) {
      scope.handleDeleteStock = function(stock) {
        scope.deleteStock(stock);
      }
    }
  };
}
