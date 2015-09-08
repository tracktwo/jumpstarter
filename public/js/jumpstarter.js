(function () {
  var app = angular.module('jumpstarter', ['ui.bootstrap', 'tabs', 'barracks', 'research']);

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

    $http.get("data/research.json").then(function (response) {
      $scope.Research = response.data;
    });

    $http.get("data/foundry.json").then(function (response) {
      $scope.Foundry = response.data;
    });

    $http.get("data/ots.json").then(function (response) {
      $scope.OTS = response.data;
    });

    $scope.ini = {
      soldiers: [],
      research: [],
      foundry: [],
      ots: []
    };

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
        opts: "=",
        order: "@"
      },
      link: function($scope, element, attrs) {
        $scope.currentItem = "";

        $scope.addItem = function(item) {
          $scope.list.push(item);
          $scope.currentItem = "";
        };

        $scope.removeItem = function(idx) {
          $scope.list.splice(idx, 1);
        };

        $scope.isItemInvalid = function(item) {
          return item == "" || $scope.list.indexOf(item) != -1;
        };

        $scope.removePresent = function(value) {
          return $scope.list.indexOf(value.name) == -1;
        }
      },
      templateUrl: 'select-list-panel.html'
    }
  });

})();


