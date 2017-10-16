(function () {
  var app = angular.module('jumpstarter',
    ['ui.bootstrap', 'tabs', 'basic', 'barracks', 'research', 'items', 'facilities', 'world', 'airforce', 'lr.upload']);

  app.controller('JumpStarterCtrl', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
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

    $scope.OfficerRanks = [
        { name: "None", enum:0 },
        { name: "Lieutenant", enum:1 },
        { name: "Captain", enum:2 },
        { name: "Major", enum:3 },
        { name: "Colonel", enum:4 },
        { name: "Field Cmdr", enum:5 }
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
        return v.enum == enumVal;
      });
      if (results.length == 0) {
        return "";
      }
      return results[0].name;
    };

    $scope.ensureArray = function(v) {
        if (!angular.isArray(v)) {
            return [v];
        } else { 
            return v;
        }
    };

    $scope.onIniFailed = function(response) {
        var msg = response.data.replace(/\n/g,"<br>");
        var failedDialog = $modal.open({
            size: 'sm',
            template: '<div class="modal-header"><h3 class="modal-title">Upload Failed</h3></div>' +
                '<div class="modal-body"><p>The ini upload has failed with the following error:</p><p>' + msg + '</div>'
                });
    }

    $scope.initSoldier = function() {
      return {
        firstName: "",
        lastName: "",
        nickName: "",
        rank: $scope.Ranks[0].enum,
        class: $scope.Classes[0].enum,
        gender: $scope.Genders[0].enum,
        psiRank: $scope.PsiRanks[0].enum,
        officerRank: $scope.OfficerRanks[0].enum,
        country: -1,
        classPerks: ["", "", "", "", "", ""],
        psiPerks: ["", "", "", "", "", ""],
        officerPerks: ["", "", "", "", ""],
        extraPerks: [],
        hp: 0,
        aim: 0,
        will: 0,
        mob: 0,
        defense: 0,
        bonusAttrib: true
      };
    };

    $scope.onIniUpload = function(response) {
        var uploaded = response.data;
        var basicProps = [
         { key: "SLINGSHOT_START_DAYS", value: "slingshotDelay" },
         { key: "EXALT_CLUE_COUNT", value: "exaltClues" },
         { key: "ALIEN_RESEARCH", value: "alienResearch" },
         { key: "ALIEN_RESOURCES", value: "alienResources" },
         { key: "XCOM_THREAT", value: "xcomThreat" },
         { key: "CREDITS", value: "credits" },
         { key: "FRAGMENTS", value: "fragments" },
         { key: "ALLOYS", value: "alloys" },
         { key: "ELERIUM", value: "elerium" },
         { key: "SCIENTISTS", value: "scientists" },
         { key: "ENGINEERS", value: "engineers" },
         { key: "MELD", value: "meld" },
         { key: "RANDOM_BASES", value: "randombases" }
        ];

        $scope.resetIni();
    
        basicProps.forEach(function(elem,idx) {
            if (uploaded.hasOwnProperty(elem.key) && !angular.isArray(uploaded[elem.key])) {
                $scope.ini[elem.value] = uploaded[elem.key];
            }
        });
        
        var startMonth = 3;
        var startDay = 1;
        var startYear = 2016;
        for (var k in uploaded) {
            if (uploaded.hasOwnProperty(k)) {
                var lc = k.toLowerCase();
                if (lc === "airforce") {
                    var af = $scope.ensureArray(uploaded[k]);
                    af.forEach(function(elem,idx) {
                        var ship = {};
                        ship.kills = elem.iKills;
                        ship.weapon = elem.iWeapon;
                        ship.firestorm = elem.bFirestorm;
                        ship.continent = elem.iContinent;
                        $scope.ini.airforce.push(ship);
                    });
                } else if (lc === "start_day") {
                    startDay = uploaded[k];
                } else if (lc === "start_month") {
                    startMonth = uploaded[k];
                } else if (lc === "start_year") {
                    startYear = uploaded[k];
                } else if (lc === "paniclevel") {
                    var pl = $scope.ensureArray(uploaded[k]);
                    pl.forEach(function(elem, idx) {
                        $scope.ini.countries[elem.iCountry].panic = elem.iAmount;
                    });
                } else if (lc === "satellite") {
                    var sat = $scope.ensureArray(uploaded[k]);
                    sat.forEach(function(elem, idx) {
                        $scope.ini.countries[elem].satellite = true;
                    });
                } else if (lc === "alienbase") {
                    var base = $scope.ensureArray(uploaded[k]);
                    base.forEach(function(elem, idx) {
                        $scope.ini.countries[elem].alienbase = true;
                    });
                } else if (lc === "facility") {
                    var fac = $scope.ensureArray(uploaded[k]);
                    fac.forEach(function(elem, idx) {
                        $scope.ini.facilities[elem.Y - 1][elem.X] = elem.iType;
                    });
                } else if (lc === "tile") {
                    var tiles = $scope.ensureArray(uploaded[k]);
                    tiles.forEach(function(elem, idx) {
                        $scope.ini.facilities[elem.Y - 1][elem.X] = elem.iType;
                    });
                } else if (lc === "storage") {
                    var stor = $scope.ensureArray(uploaded[k]);
                    stor.forEach(function(elem,idx) {
                        var it = { enum: elem.iType.toString(), count: elem.iCount };
                        $scope.ini.items.push(it);
                    });
                } else if (lc === "research") {
                    var res = $scope.ensureArray(uploaded[k]);
                    res.forEach(function(elem) { 
                        $scope.ini.research.push(elem);
                    });
                } else if (lc === "foundry") {
                    var found = $scope.ensureArray(uploaded[k]);
                    found.forEach(function(elem) {
                        $scope.ini.foundry.push(elem);
                    });
                } else if (lc === "ots") {
                    var o = $scope.ensureArray(uploaded[k]);
                    o.forEach(function(elem) {
                        $scope.ini.ots.push(elem);
                    });
                } else if (lc === "soldier") {
                    var soldiers = $scope.ensureArray(uploaded[k]);
                    soldiers.forEach(function(elem, idx) {
                        var s = $scope.initSoldier();
                        var soldierProps = [
                            { key: "iRank", value: "rank" },
                            { key: "iClass", value: "class" },
                            { key: "iGender", value: "gender" },
                            { key: "iPsiRank", value: "psiRank" },
                            { key: "iOfficerRank", value: "officerRank" },
                            { key: "strFirstName", value: "firstName" },
                            { key: "strLastName", value: "lastName" },
                            { key: "strNickName", value: "nickName" },
                            { key: "iHP", value: "hp" },
                            { key: "iAim", value: "aim" },
                            { key: "iMobility", value: "mob" },
                            { key: "iWill", value: "will" },
                            { key: "iDefense", value: "defense" },
                            { key: "bAttribBonus", value: "bonusAttrib" },
                            { key: "iCountry", value: "country" },
                        ];

                        soldierProps.forEach(function(e,i) { 
                            if (elem.hasOwnProperty(e.key)) {
                                s[e.value] = elem[e.key];
                            }
                        });
                        
                        if (elem.hasOwnProperty("iPerk")) {
                            var perks = $scope.ensureArray(elem.iPerk);
                            s.extraPerks = [];
                            s.classPerks = ["","","","","",""];
                            s.psiPerks = ["","","","","",""];
                            s.officerPerks = ["","","","",""];
                            perks.forEach(function(e, i) {
                                var found = false;
                                for (var r = 2; r < 6; ++r) {
                                    for (var i = 0; i < 3; ++i) {
                                        if (e === $scope.ClassPerks[$scope.getClassName(s.class)][$scope.Ranks[r].name][i]) {
                                            s.classPerks[r-2] = e;
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                                if (!found) {
                                    for (r = 1; r <= s.psiRank; ++r) {
                                        var psiRankName = $scope.getPsiRankName(r);
                                        for (var i = 0; i < $scope.PsiPerks[psiRankName].length; ++i) {
                                            if (e === $scope.PsiPerks[psiRankName][i]) {
                                                s.psiPerks[r-1] = e;
                                                found = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (!found) {
                                    for (r = 1; r <= s.officerRank; ++r) {
                                        var officerRankName = $scope.getOfficerRankName(r);
                                        for (var i = 0; i < $scope.OfficerPerks[officerRankName].length; ++i) {
                                            if (e === $scope.OfficerPerks[officerRankName][i]) {
                                                s.officerPerks[r-1] = e;
                                                found = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (!found) {
                                    s.extraPerks.push(e);
                                }
                            });
                        }
                        $scope.ini.soldiers.push(s);
                    });
                }
                else if (lc === 'blanksoldier') {
                    var bulk = $scope.ensureArray(uploaded[k]);
                    var bulkProps = [
                        { key: "iRank", value: "rank" },
                        { key: "iCount", value: "count" },
                        { key: "iCountry", value: "country" },
                        { key: "iGender", value: "gender" }
                    ];
                    bulk.forEach(function(elem,idx) {
                        var bs = {};
                        bulkProps.forEach(function(e,i) {
                            if (elem.hasOwnProperty(e.key)) {
                                bs[e.value] = elem[e.key];
                            }
                        });
                        $scope.ini.bulkSoldiers.push(bs);
                    });
                }
            }
        }
        $scope.ini.startDate = new Date("" + startYear + "/" + startMonth + "/" + startDay);
    }

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

    $scope.getPsiRankName = function(e) {
        return $scope.getNameFromEnum($scope.PsiRanks, e);
    };

    $scope.getOfficerRankName = function(e) {
        return $scope.getNameFromEnum($scope.OfficerRanks, e);
    };

    $scope.getPsiRankIndex = function(r) {
      for (var i = 0; i < $scope.PsiRanks.length; ++i) {
        if ($scope.PsiRanks[i].enum === r) {
          return i;
        }
      }
      return -1;
    };

    $scope.getOfficerRankIndex = function(r) {
        for (var i = 0; i < $scope.OfficerRanks.length; ++i) {
            if ($scope.OfficerRanks[i].enum === r) {
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

    $http.get("data/officer-perks.json").then(function (response) {
        $scope.OfficerPerks = response.data;
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

    $scope.resetIni = function() {
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
    };

    $scope.resetIni();

    $scope.showDateWarning = function() {
        var diff = (new Date($scope.ini.startDate) - new Date("2016-03-01"));
        return $scope.ini.startDate != "" &&
                diff < 0;
    }

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


