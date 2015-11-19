angular
  .module('stockPortfolioApp')
  .factory('SessionFactory', SessionFactory);

function SessionFactory($location) {
  var factory = {};
  return factory = {
    inSession: function() {
      var currentUser = Parse.User.current();
      if (!currentUser) {
          console.log("route to sign");
          var route = '/sign';
          $location.url(route);
      } else {
        console.log("route to dashboard");
        var route = '/dashboard';
        $location.url(route);
      }
    },
    logOut: function() {
      return Parse.User.logOut().then(function() {
        factory.inSession();
      });
    }
  };
}
