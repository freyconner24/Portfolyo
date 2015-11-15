angular
  .module('stockPortfolioApp')
  .factory('SignFactory', SignFactory);

function SignFactory($location) {
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
    signUp: function(name, email, password) {
      var user = new Parse.User();
      user.set("username", name);
      user.set("password", password);
      user.set("email", email);
      console.log(name, password, email);

      user.signUp(null, {
        success: function(user) {
          console.log("User " + name + " has signed up!");
        },
        error: function(user, error) {
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    },
    signIn: function(email, password) {
      var query = new Parse.Query(Parse.User);
      query.equalTo("email", email);
      query.first({
        success: function(user) {
          user.fetch().then(function(user) {
            Parse.User.logIn(user.getUsername(), password, {
              success: function(user) {
                console.log("login");
                var route = '/dashboard';
                $location.url(route);
                return true;
              },
              error: function(user, error) {
                console.log("Error: " + error.code + " " + error.message);
                return false;
              }
            });
          }, function(error) {
              //Handle the error
              return false;
          });
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
          return false;
        }
      });
    }
  };
}
