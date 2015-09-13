(function() {
    var app = angular.module('items', []);

    app.controller('ItemCtrl', ['$scope', function ($scope) {
      this.currentItem = "";
      this.currentCount = 1;

      this.removePresent = function(it) {

        return $scope.ini.items.filter(function (v) {
          return v.enum === it.enum;
        }).length == 0;
      };

      this.addItem = function() {
        $scope.ini.items.push({ enum: this.currentItem, count: this.currentCount } );
        this.currentItem = "";
        this.currentCount = 1;
      };

      this.removeItem = function(idx) {
        $scope.ini.items.splice(idx, 1);
      };

      this.isItemInvalid = function() {
        return this.currentItem == "" || this.currentCount <= 0;
      };
    }]);
  }
)();
