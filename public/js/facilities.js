(function() {
    var app = angular.module('facilities', []);

    app.controller('FacilitiesCtrl', ['$scope', '$window', function ($scope, $window) {
      this.toggleLift = function(y) {
        if ($scope.ini.facilities[y][3] == 'eFacility_None') {
          $scope.ini.facilities[y][3] = 'eFacility_AccessLift';
        } else {
          $scope.ini.facilities[y][3] = 'eFacility_None';
        }
        // Don't keep the button focused
        $window.document.activeElement.blur();
      };

      this.getLiftName = function(y) {
        return $scope.ini.facilities[y][3] == "eFacility_None" ? "None" : "Lift";
      };
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

