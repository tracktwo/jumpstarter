(function() {
    var app = angular.module('airforce', []);

    app.controller('AirForceCtrl', ['$scope', function ($scope) {
      this.continent = "";
      this.weapon = "eItem_IntWeap_II";
      this.firestorm = false;
      this.kills = 0;

      this.addShip = function() {
        $scope.ini.airforce.push({
          continent: this.continent,
          weapon:this.weapon,
          kills:this.kills,
          firestorm:this.firestorm
        });

        this.continent = "";
        this.weapon = "eItem_IntWeap_II";
        this.kills = 0;
        this.firestorm = false;
      };

      this.removeShip = function(idx) {
        $scope.ini.airforce.splice(idx, 1);
      };

      this.isShipInvalid = function() {
        return this.continent == "";
      };
    }]);
  }
)();
