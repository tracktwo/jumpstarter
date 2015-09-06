(function() {
    var app = angular.module('jumpstarter', ['ui.bootstrap', 'tabs', 'barracks']);

    app.controller('JumpStarterCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.Ranks = [
            "PFC",
            "SPEC",
            "LCPL",
            "CPL",
            "SGT",
            "TSGT",
            "GSGT",
            "MSGT"
        ];

        $scope.Classes = [
            "None",
            "Sniper",
            "Scout",
            "Assault",
            "Infantry",
            "Rocketeer",
            "Gunner",
            "Medic",
            "Engineer"
        ];

        $scope.Genders = [
            "",
            "M",
            "F"
        ];

        $scope.Countries = [
            "Unspecified"
        ];

        $scope.PsiRanks = [
            "None",
            "Awakened",
            "Sensitive",
            "Talent",
            "Adept",
            "Psion",
            "Master"
        ];

        $scope.getPerkName = function(perkEnum) {
            return $scope.Perks.filter(function(v) {
                return v.enum === perkEnum;
            })[0].name;
        };

        $http.get("data/countries.json").then( function (response) {
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
    }]);

    // Workaround for triggering change events on keyboard use with select elements.
    app.directive("select", function() {
        return {
            restrict: "E",
            require: "?ngModel",
            scope: false,
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                element.bind("keyup", function() {
                    element.triggerHandler("change");
                })
            }
        }
    })

})();


