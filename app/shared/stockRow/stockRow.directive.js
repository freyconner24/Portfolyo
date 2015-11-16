angular
  .module('stockPortfolioApp')
  .directive('stockRow', StockRowDirective);

function StockRowDirective() {
  return {
    restrict: 'E', //makes the directive as an element only
    templateUrl: 'app/shared/stockRow/stockRow.directive.html',
    scope: {
      stock: "=stock",
      deleteStock: "&"
    },
    link: function(scope) {
      scope.handleDeleteStock = function() {
        scope.deleteStock({stock: scope.stock});
        scope.stock.isDeleted = true;
      }
    }
  };
}
