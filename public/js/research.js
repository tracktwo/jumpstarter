(function() {
  var app = angular.module('research', []);

  app.controller('ResearchCtrl', ['$scope', function($scope) {
    $scope.ini.research = [];

    this.addResearch = function(item) {
      $scope.ini.research.push(item);
    };

    this.removeResearch = function(idx) {
      $scope.ini.research.splice(idx, 1);
    }

    this.isResearchInvalid = function(item) {
      return item == "" || $scope.ini.research.indexOf(item) != -1;
    }
  }]);
})();

