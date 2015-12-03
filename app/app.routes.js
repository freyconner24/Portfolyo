angular
  .module('stockPortfolioApp')
  .config(config);

function config($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/components/sign/sign.view.html',
      controller: 'SignController',
      controllerAs: 'vm'
    })
    .when('/sign', {
      templateUrl: '/app/components/sign/sign.view.html',
      controller: 'SignController',
      controllerAs: 'vm'
    })
    .when('/dashboard', {
      templateUrl: '/app/components/dashboard/dashboard.view.html',
      controller: 'DashboardController',
      controllerAs: 'vm'
    });

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  $locationProvider.hashPrefix('!');
}
