angular
  .module('stockPortfolioApp')
  .factory('SessionFactory', SessionFactory);

function SessionFactory($location) {
  return {
    inSession: function() {
      var currentUser = Parse.User.current();
      if (!currentUser) {
          var route = '/sign';
          $location.url(route);
      } else {
        var route = '/dashboard';
        $location.url(route);
      }
    },
    logOut: function() {
      Parse.User.logOut();
      var currentUser = Parse.User.current();
      if(!currentUser) {
        this.inSession();
      }
    }
  };
}
