(function () {
  var app = angular.module('jumpstarter', ['ui.bootstrap', 'tabs', 'barracks']);

  // Services
  app.factory('auth', ['$http', '$window', function ($http, $window) {
    var auth = {};

    auth.saveToken = function(token) {
      $window.localStorage['jumpstarter-token'] = token;
    };

    auth.getToken = function(token) {
      return $window.localStorage['jumpstarter-token'];
    };

    auth.getPayload = function(token) {
      return JSON.parse($window.atob(token.split('.')[1]));
    };

    auth.isLoggedIn = function() {
      var token = auth.getToken();
      if (token) {
        var payload = auth.getPayload(token);
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    auth.currentUser = function() {
      if (auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = auth.getPayload(token);
        return payload.username;
      }
    };

    auth.register = function(user) {
      return $http.post('/register', user).success(function(data) {
        auth.saveToken(data.token);
      });
    };

    auth.login = function(user) {
      return $http.post('/login', user).success(function(data) {
        auth.saveToken(data.token);
      })
    };

    auth.logout = function(user) {
      $window.localStorage.removeItem('jumpstarter-token');
    };

    return auth;
  }]);



  app.controller('JumpStarterCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.Ranks = [
      "PFC",
      "SPEC",
      "LCPL",
      "CPL",
      "SGT",
      "TSGT",
      "GSGT",
      "MSGT"
    ];

    $scope.Classes = [
      "None",
      "Sniper",
      "Scout",
      "Assault",
      "Infantry",
      "Rocketeer",
      "Gunner",
      "Medic",
      "Engineer"
    ];

    $scope.Genders = [
      "",
      "M",
      "F"
    ];

    $scope.Countries = [
      "Unspecified"
    ];

    $scope.PsiRanks = [
      "None",
      "Awakened",
      "Sensitive",
      "Talent",
      "Adept",
      "Psion",
      "Master"
    ];

    $scope.getPerkName = function (perkEnum) {
      return $scope.Perks.filter(function (v) {
        return v.enum === perkEnum;
      })[0].name;
    };

    $http.get("data/countries.json").then(function (response) {
      $scope.Countries = response.data;
    });

    $http.get("data/class-perks.json").then(function (response) {
      $scope.ClassPerks = response.data;
    });

    $http.get("data/perks.json").then(function (response) {
      $scope.Perks = response.data;
    });

    $http.get("data/psi-perks.json").then(function (response) {
      $scope.PsiPerks = response.data;
    });

    $http.get("data/class-stats.json").then(function (response) {
      $scope.ClassStats = response.data;
    });

    $scope.ini = {};
  }]);

  // Workaround for triggering change events on keyboard use with select elements.
  app.directive("select", function () {
    return {
      restrict: "E",
      require: "?ngModel",
      scope: false,
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        element.bind("keyup", function () {
          element.triggerHandler("change");
        })
      }
    }
  });

  app.directive('selectListPanel', function() {
    return {
      restrict: "E",
      scope: {
        title: "@",
        list: "=",
        deleteFn: "&",
        addFn: "&",
        disabledFn: "&",
        ngModel: "=",
        opts: "=",
        order: "@"
      },
      link: function(scope, element, attrs) {
        scope.currentItem = "";
      },
      templateUrl: 'select-list-panel.html'
    }
  });

})();


