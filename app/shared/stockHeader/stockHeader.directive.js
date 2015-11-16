angular
  .module('stockPortfolioApp')
  .directive('stockHeader', StockHeaderDirective);

function StockHeaderDirective() {
  return {
    restrict: 'E', //makes the directive as an element only
    templateUrl: 'app/shared/stockHeader/stockHeader.directive.html',
    scope: {
      logOut: "&",
      username: "=",
    },
    link: function(scope) {
      scope.handleLogOut = function() {
        scope.logOut();
      }
    }
  };
}
