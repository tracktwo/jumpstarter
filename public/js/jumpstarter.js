(function () {
  var app = angular.module('jumpstarter',
    ['ui.bootstrap', 'tabs', 'basic', 'barracks', 'research', 'items', 'facilities', 'world', 'airforce']);

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
      { name: "PFC", enum: "eRank_Rookie" },
      { name: "SPEC", enum: "eRank_Squaddie" },
      { name: "LCPL", enum: "eRank_Corporal" },
      { name: "CPL", enum: "eRank_Sergeant" },
      { name: "SGT", enum: "eRank_Lieutenant" },
      { name: "TSGT", enum: "eRank_Captain" },
      { name: "GSGT", enum: "eRank_Major" },
      { name: "MSGT", enum: "eRank_Colonel" }
    ];

    $scope.Classes = [
      { name: "None", enum: "eSC_None" },
      { name: "Sniper", enum: 11 },
      { name: "Scout", enum: 21 },
      { name: "Assault", enum: 14 },
      { name: "Infantry", enum: 24 },
      { name: "Rocketeer", enum: 12 },
      { name: "Gunner", enum: 22 },
      { name: "Medic", enum: 13 },
      { name: "Engineer", enum: 23 }
    ];

    $scope.Genders = [
      { name: "", enum: "eGender_None" },
      { name: "M", enum: "eGender_Male" },
      { name: "F", enum: "eGender_Female" }
    ];

    $scope.Countries = [
      "Unspecified"
    ];

    $scope.PsiRanks = [
      { name: "None", enum: 0 },
      { name: "Awakened", enum: 1 },
      { name: "Sensitive", enum: 2 },
      { name: "Talent", enum: 3 },
      { name: "Adept", enum: 4 },
      { name: "Psion", enum: 5 },
      { name: "Master", enum: 6 }
    ];

    $scope.Continents = [
      { enum: "eContinent_NorthAmerica", name: "North America" },
      { enum: "eContinent_SouthAmerica", name: "South America" },
      { enum: "eContinent_Europe", name: "Europe" },
      { enum: "eContinent_Africa", name: "Africa" },
      { enum: "eContinent_Asia", name: "Asia" }
    ];

    $scope.Tiles = [
      { "enum": "eTile_Excavated", "name": "Excavated" },
      { "enum": "eTile_Steam", "name": "Steam Vent" },
      { "enum": "eTile_ExcavatedSteam", "name": "Excavated Steam" }
    ];

    $scope.getNameFromEnum = function (dataSet, enumVal) {
      if (dataSet.length == 0)
      {
        return "";
      }

      var results = dataSet.filter(function (v) {
        return v.enum === enumVal;
      });
      if (results.length == 0) {
        return "";
      }
      return results[0].name;
    };

    $scope.getPerkName = function (perkEnum) {
      return $scope.getNameFromEnum($scope.Perks, perkEnum);
    };

    $scope.getItemName = function(itemEnum) {
      return $scope.getNameFromEnum($scope.Items, itemEnum);
    };

    $scope.getGenderName = function(genderEnum) {
      return $scope.getNameFromEnum($scope.Genders, genderEnum);
    };

    $scope.getFacilityOrTileName = function(facEnum) {
      var name = $scope.getNameFromEnum($scope.Facilities, facEnum);
      if (name != "")
        return name;
      else
        return $scope.getNameFromEnum($scope.Tiles, facEnum);
    };

    $scope.getCountryName = function(countryIdx) {
      return $scope.Countries[countryIdx+1];
    };

    $scope.getContinentName = function(continentEnum) {
      return $scope.getNameFromEnum($scope.Continents, continentEnum);
    };

    $scope.getResearchName = function(e) {
      return $scope.getNameFromEnum($scope.Research, e);
    };

    $scope.getFoundryName = function(e) {
      return $scope.getNameFromEnum($scope.Foundry, e);
    };

    $scope.getOTSName = function(e) {
      return $scope.getNameFromEnum($scope.OTS, e);
    };

    $scope.getClassName = function(e) {
      return $scope.getNameFromEnum($scope.Classes, e);
    };

    $scope.getRankName = function(e) {
      return $scope.getNameFromEnum($scope.Ranks, e);
    };

    $scope.getRankIndex = function(r) {
      for (var i = 0; i < $scope.Ranks.length; ++i) {
        if ($scope.Ranks[i].enum === r) {
          return i;
        }
      }
      return -1;
    };

    $scope.getPsiRankIndex = function(r) {
      for (var i = 0; i < $scope.PsiRanks.length; ++i) {
        if ($scope.PsiRanks[i].enum === r) {
          return i;
        }
      }
      return -1;
    };

    $scope.getCountryIndex = function(countryName) {
      return $scope.Countries.indexOf(countryName)-1;
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

    $http.get("data/ship-weapons.json").then(function (response) {
      $scope.ShipWeapons = response.data;
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
      randombases: -1,

      soldiers: [],
      bulkSoldiers: [],
      research: [],
      foundry: [],
      ots: [],
      items: [],
      facilities: [
        ["eFacility_None", "eFacility_None", "eFacility_SmallRadar", "eFacility_AccessLift", "eFacility_None", "eFacility_None", "eFacility_None"],
        ["eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None"],
        ["eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None"],
        ["eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None", "eFacility_None"]
      ],
      countries: {},
      airforce: []
    };

    $scope.showDateWarning = function() {
        var diff = (new Date($scope.ini.startDate) - new Date("2016-03-01"));
        return $scope.ini.startDate != "" &&
                diff < 0;
    }

    $scope.ini.countries.eCountry_Canada = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_USA = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Mexico = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Argentina = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Brazil = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Egypt = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Nigeria = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_SouthAfrica = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_UK = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_France = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Germany = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Russia = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_India = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_China = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Japan = {panic: 0, satellite:false, alienbase:false};
    $scope.ini.countries.eCountry_Australia = {panic: 0, satellite:false, alienbase:false};

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
        order: "@",
        render: "&",
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

        // Given a value in the list of options (a name/enum object) 
        // filter out any enums already present in list.
        $scope.removePresent = function(value) {
            var v = $scope.list.filter(function(v) {
                return v === value.enum;
            }).length == 0;
            return v;
        }
      },
      templateUrl: 'select-list-panel.html'
    }
  });

})();


