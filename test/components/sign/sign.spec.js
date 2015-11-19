angular
  .module('stockPortfolioApp')
  .factory('SignFactory', SignFactory);

function SignFactory($location, SessionFactory) {
  return factory = {
    signUp: function(name, email, password) {
      var user = new Parse.User();
      user.set("username", name);
      user.set("password", password);
      user.set("email", email);

      return user.signUp(null).then(function(user) {
        console.log("User " + name + " has signed up!");
      });
    },
    signIn: function(email, password) {
      var query = new Parse.Query(Parse.User);
      query.equalTo("email", email);
      return query.first().then(function(user) {
        return user.fetch();
      }).then(function(user) {
        return Parse.User.logIn(user.getUsername(), password);
      }).then(function(user) {
        console.log("login");
      });
    }
  };
}
