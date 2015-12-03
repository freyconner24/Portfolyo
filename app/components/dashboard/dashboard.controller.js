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
  vm.getPortfolios = getPortfolios;
  vm.logOut = logOut;
  vm.addStock = addStock;
  vm.showPortfolioInput = showPortfolioInput;
  vm.deleteStock = deleteStock;
  vm.deletePortfolio = deletePortfolio;
  vm.addPortfolio = addPortfolio;
  vm.stockModal = stockModal;
  vm.closeModal = closeModal;

  Parse.User.current().fetch().then(function(user) {
    vm.user.username = user.get('username');
    vm.user.email = user.get('email');
  });

  function getPortfolios() {
    PortfolioFactory.getPortfolios()
      .then(function(portfolios) {
        vm.portfolios = portfolios;
        $scope.$apply();
      });
  }

  function logOut() {
    SessionFactory.logOut()
    .then(function() {
      vm.portfolios = [];
      vm.modalStock = {};
      vm.user = {};
    });
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
      });
  }

  function addPortfolio() {
    PortfolioFactory.addPortfolio(vm)
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
      .then(function(portfolios) {
        vm.portfolios = portfolios;
        $scope.$apply();
      });
  }

  function stockModal(stock) {
    ModalFactory.stockModal(stock)
      .then(function(response) {
        vm.stockModalIsVisible = response.vmStockModalIsVisible;
      });
  }

  function closeModal() {
    vm.stockModalIsVisible = ModalFactory.closeModal();
  }
}
