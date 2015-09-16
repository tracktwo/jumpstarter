(function () {
  var app = angular.module('jumpstarter',
    ['ui.bootstrap', 'tabs', 'basic', 'barracks', 'research', 'items', 'facilities', 'world']);

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

    $scope.getNameFromEnum = function (dataSet, enumVal) {
      return dataSet.filter(function (v) {
        return v.enum === enumVal;
      })[0].name;
    };

    $scope.getPerkName = function (perkEnum) {
      return $scope.getNameFromEnum($scope.Perks, perkEnum);
    };

    $scope.getItemName = function(itemEnum) {
      return $scope.getNameFromEnum($scope.Items, itemEnum);
    };

    $scope.getFacilityName = function(facEnum) {
      return $scope.getNameFromEnum($scope.Facilities, facEnum);
    };

    $scope.getCountryName = function(countryEnum) {
        return $scope.getNameFromEnum($scope.CouncilMembers, countryEnum);
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

    $http.get("data/items.json").then(function (response) {
      $scope.Items = response.data;
    });

    $http.get("data/facilities.json").then(function (response) {
      $scope.Facilities = response.data;
    });

    $http.get("data/council-members.json").then(function (response) {
        $scope.CouncilMembers = response.data;
    });

    $scope.ini = {
      title: "",
      author: "",
      startDate: "",
      exaltClues: -1,
      slingshotDelay: -1,
      alienResearch: -1,
      alienResources: -1,
      xcomThreat: -1,
      credits: -1,
      fragments: -1,
      alloys: -1,
      elerium: -1,
      scientists: -1,
      engineers: -1,
      meld: -1,

      soldiers: [],
      bulkSoldiers: [0, 0, 0, 0, 0, 0, 0, 0],
      research: [],
      foundry: [],
      ots: [],
      items: [],
      facilities: [
        ["eFacility_None", "eFacility_None", "eFacility_SmallRadar", "eFacility_AccessLift", "eFacility_None", "eFacility_None", "eFacility_None"],
        ["eFacility_None", "eFacility_None", "eFacility_None", "eFacility_AccessLift", "eFacility_None", "eFacility_None", "eFacility_None"],
        ["eFacility_None", "eFacility_None", "eFacility_None", "eFacility_AccessLift", "eFacility_None", "eFacility_None", "eFacility_None"],
        ["eFacility_None", "eFacility_None", "eFacility_None", "eFacility_AccessLift", "eFacility_None", "eFacility_None", "eFacility_None"]
      ],
      countries: []
    };

    $scope.ini.countries['eCountry_Canada'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_USA'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Mexico'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Argentina'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Brazil'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Nigeria'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_SouthAfrica'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_UK'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_France'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Germany'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Russia'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_India'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_China'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Japan'] = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries['eCountry_Australia'] = {panic: 0, satellite:false, alienbase:false};

    this.buildIni = function() {
     $http.post("/buildini", $scope.ini).then(function (response) {
       var blob = new Blob([response.data], {type: "text/plain"});
       var url = window.URL || window.webkitURL;
       var link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
       var event = document.createEvent("MouseEvents");

       link.href=  url.createObjectURL(blob);
       link.download = "DefaultJumpStart.ini";
       event.initEvent('click', true, false);
       link.dispatchEvent(event);
      });
    }


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


