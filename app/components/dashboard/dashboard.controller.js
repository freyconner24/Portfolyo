angular
  .module('stockPortfolioApp')
  .controller('DashboardController', DashboardController);

function DashboardController(SessionFactory, ModalFactory, StockFactory, PortfolioFactory, $scope, $http, $window) {
  SessionFactory.inSession();
  var vm = this;
  vm.user = {};
  vm.isNewPortfolio = false;
  vm.stockModalIsVisible = false;
  vm.newPortfolioTitle = "";
  vm.portfolios = [];
  vm.modalStock = {};
  vm.logOut = logOut;
  vm.addStock = addStock;
  vm.showPortfolioInput = showPortfolioInput;
  vm.deleteStock = deleteStock;
  vm.deletePortfolio = deletePortfolio;
  vm.newPortfolio = newPortfolio;
  vm.stockModal = stockModal;
  vm.closeModal = closeModal;

  Parse.User.current().fetch().then(function(user) {
    vm.user.username = user.get('username');
    vm.user.email = user.get('email');
  });

  PortfolioFactory.getPortfolios()
    .then(function(vmPortfolios) {
      console.log("controller", vmPortfolios);
      vm.portfolios = vmPortfolios;
      $scope.$apply();
    });

  function logOut() {
    SessionFactory.logOut();
  }

  function showPortfolioInput() {
    vm.isNewPortfolio = true;
    setTimeout(function() {
      $window.document.getElementById("newPortfolioInput").focus();
    }, 30);
  }

  function addStock(object) {
    StockFactory.addStock(object, vm.portfolios)
      .then(function(portfolios) {
        vm.portfolios = portfolios;
        $scope.$apply();
      });
  }

  function newPortfolio() {
    PortfolioFactory.newPortfolio(vm.portfolios, vm.newPortfolioTitle)
      .then(function(newPortfolio) {
        vm.portfolios.push(newPortfolio);
        vm.newPortfolioTitle = "";
        vm.isNewPortfolio = false;
        $scope.$apply();
      });
  }

  function deleteStock(stock) {
    StockFactory.deleteStock(stock, vm.portfolios)
      .then(function(portfolios) {
        vm.portfolios = portfolios;
        $scope.$apply();
      });
  }

  function deletePortfolio(portfolio) {
    PortfolioFactory.deletePortfolio(portfolio, vm.portfolios)
      .then(function() {
        vm.portfolios = portfolios;
        $scope.$apply();
      });
  }

  function stockModal(stock) {
    ModalFactory.stockModal(stock);
  }

  function closeModal() {
    vm.stockModalIsVisible = ModalFactory.closeModal();
  }
}

function isDuplicateTicker (ticker, portfolio) {
  for(var i = 0; i < portfolio.stocks.length; ++i) {
    if(ticker === portfolio.stocks[i].ticker) {
      console.log("can't insert duplicate stock");
      return true;
    }
  }
  return false;
}
