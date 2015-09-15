(function() {
    var app = angular.module('facilities', []);

    app.controller('FacilitiesCtrl', ['$scope', function ($scope) {
    }]);

    app.directive('facilityButton', function() {
      return {
        restrict: 'E',
        require: "?ngModel",
        scope: {
          ngModel: "=",
          width: "@",
          render: "&",
          items: "=",
          order: "@",
          filter: "="
        },
        templateUrl: 'facility-button.html',
        link: function(scope, elem, attrs, ngModel) {
          if (!ngModel) {
            return;
          }

          scope.selectItem = function(eValue) {
            ngModel.$setViewValue(eValue);
          }
        }
      }
      ;
    });
  }
)();

