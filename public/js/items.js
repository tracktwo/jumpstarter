(function() {
    var app = angular.module('items', []);

    app.controller('ItemCtrl', ['$scope', function ($scope) {
      this.currentItem = "";
      this.currentCount = 1;

      $scope.removePresent = function(value) {
        return $scope.ini.items.indexOf(value.name) == -1;
      };
    }]);
  }
)();
