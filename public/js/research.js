(function() {
  var app = angular.module('research', []);

  app.controller('ResearchCtrl', ['$scope', function($scope) {
    $scope.ini.research = [];
    $scope.ini.foundry = [];
  }]);
})();

