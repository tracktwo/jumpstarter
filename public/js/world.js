(function () {
  var app = angular.module('world', []);

  app.controller('WorldCtrl', ['$scope', function ($scope) {
  }]);

  app.directive('countryForm', function () {
    return {
      restrict: 'E',
      scope: {
        country: "@",
        ngModel: "="
      },
      templateUrl: 'country-form.html'
    };
  });
})();
