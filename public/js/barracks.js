(function() {
    var app = angular.module('barracks', []);

    app.controller('CustomSoldierCtrl', ['$scope', function($scope) {
        this.curSoldier = null;

        this.editSoldier = function(soldier) {
            if (this.curSoldier == soldier) {
                this.curSoldier = null;
            }
            else {
                this.curSoldier = soldier;
            }
            $scope.$broadcast('soldierChange', this.curSoldier);
        };

        this.isSelected = function(soldier) {
            return this.curSoldier === soldier;
        };

        this.addSoldier = function(soldier) {
            $scope.ini.soldiers.push(angular.copy(soldier));
        };

        this.saveChanges = function(soldier) {
            angular.copy(soldier, this.curSoldier);
            this.curSoldier = null;
        };

        this.printName = function(name) {
            if (name == '') {
                return "<random>";
            }
            else {
                return name;
            }
        };
    }]);

    app.controller('SoldierForm', ['$scope', function($scope) {

        this.soldier = {};
        this.curSoldier = null;

        var frm = this;

        this.resetSoldier = function () {
            this.soldier.firstName = "";
            this.soldier.lastName = "";
            this.soldier.nickName = "";
            this.soldier.rank = $scope.Ranks[0];
            this.soldier.class = $scope.Classes[0];
            this.soldier.gender = $scope.Genders[0];
            this.soldier.psiRank = $scope.PsiRanks[0];
            this.soldier.country = "";
            this.soldier.classPerks = ["", "", "", "", "", "" ];
            this.soldier.psiPerks = ["", "", "", "", "", "" ];
            this.soldier.extraPerks = [];
            this.soldier.hp = 0;
            this.soldier.aim = 0;
            this.soldier.will = 0;
            this.soldier.mob = 0;
            this.soldier.bonusattrib = true;
        };

        this.resetSoldier();

        this.submitSoldier = function (soldierCtrl) {
            if (this.isEditing()) {
                soldierCtrl.saveChanges(this.soldier);
            }
            else {
                soldierCtrl.addSoldier(this.soldier);
            }
            this.resetSoldier();
            this.curSoldier = null;
        };

        this.rankChanged = function () {
            if (this.soldier.rank == $scope.Ranks[0]) {
                this.soldier.class = $scope.Classes[0];
            }

            var rankIdx = $scope.Ranks.indexOf(this.soldier.rank);
            for (i = 0; i < 6; ++i) {
                if (rankIdx < (i + 2)) {
                    this.soldier.classPerks[i] = "";
                }

            }
        };

        this.classChanged = function () {
            // Invalidate all the class perks
            for (i = 0; i < 6; ++i)
            {
                this.soldier.classPerks[i] = "";
            }
        };

        this.isClassDisabled = function() {
            return this.soldier.rank == $scope.Ranks[0];
        };

        $scope.$on('soldierChange', function(event, s) {
            if (s == null) {
                frm.resetSoldier();
            }
            else {
                angular.copy(s, frm.soldier);
            }
            frm.curSoldier = s;
            frm.rankChanged();
        });

        this.isEditing = function() {
            return this.curSoldier != null;
        };

        this.submitLabel = function() {
            return this.isEditing() ? "Save Changes" : "Add Soldier";
        };

        this.isPerkDisabled = function(rank) {
            return this.soldier.class == "None" ||
                ($scope.Ranks.indexOf(this.soldier.rank) < $scope.Ranks.indexOf(rank));
        };

        this.isPsiPerkDisabled = function(rank) {
            return this.soldier.psiRank == "None" ||
                ($scope.PsiRanks.indexOf(this.soldier.psiRank) < $scope.PsiRanks.indexOf(rank));
        };

        this.addExtraPerk = function(prk) {
            this.soldier.extraPerks.push(prk);
        };

        this.removeExtraPerk = function(idx) {
           // var idx = this.soldier.extraPerks.indexOf(perk);
            this.soldier.extraPerks.splice(idx, 1);
        };

        this.isExtraPerkInvalid = function(prk) {
            return prk == "" ||
                this.soldier.extraPerks.indexOf(prk) != -1;
        };

        this.resetAttributes = function() {
            this.soldier.hp = 0;
            this.soldier.aim = 0;
            this.soldier.mob = 0;
            this.soldier.will = 0;
            this.soldier.bonusattrib = true;
        };
    }]);

    app.directive('perkBox', function() {
       return {
           restrict: 'E',
           scope: {
               rank: "@",
               labelWidth: "@",
               isDisabled: "=",
               ngModel: "=",
               options: "=",
               render: "&"
           },
           transclude: true,
           template: '<div class="form-group">' +
           '<label class="control-label col-xs-{{labelWidth}}">{{rank}}</label>' +
          // '</div>' +
           '<div class="col-xs-{{12-labelWidth}}"><select class="form-control" ng-disabled="isDisabled" ng-model="ngModel" ng-options="render({opt: o}) for o in options"></select></div>' +
           '</div>'
       };
    });

})();
