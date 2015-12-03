angular
  .module('stockPortfolioApp')
  .controller('SignController', SignController);

function SignController($scope, SessionFactory, SignFactory, $location) {
  SessionFactory.inSession();

  var vm = this;
  vm.name = "";
  vm.email = "";
  vm.password = "";
  vm.signUp = false;
  vm.toggleSignUpIn = toggleSignUpIn;
  vm.signUpIn = signUpIn;

  function toggleSignUpIn() {
    vm.signUp = !vm.signUp;
  };

  function signUpIn() {
    if (vm.signUp) {
      SignFactory.signUp(vm.name, vm.email, vm.password)
        .then(function() {
          SessionFactory.inSession();
          $scope.$apply();
        });
    } else {
      SignFactory.signIn(vm.email, vm.password)
        .then(function() {
          SessionFactory.inSession();
          $scope.$apply();
        });
    }
  }
}
