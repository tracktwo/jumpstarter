(function () {
  var app = angular.module('barracks', ['ui.bootstrap']);

  app.controller('CustomSoldierCtrl', ['$scope', '$modal', function ($scope, $modal) {
    var ctrl = this;

    this.getBarracksSize = function() {
      var total = $scope.ini.soldiers.length;

      $scope.ini.bulkSoldiers.forEach( function(v) {
        total += v;
      });

      return total;
    };

    this.editSoldier = function (soldier) {
      this.openSoldierDialog(soldier);
    };

    this.newSoldier = function() {
      this.openSoldierDialog(null);
    };

    this.openSoldierDialog = function(curSoldier) {
      var newSoldierDlg = $modal.open({
        scope: $scope,
        size: 'lg',
        templateUrl: 'barracks-soldier-form.html',
        controller: 'SoldierForm',
        controllerAs: 'frm',
        resolve: {
          curSoldier: function() {
            return curSoldier;
          }
        }
      });

      newSoldierDlg.result.then(function (resultSoldier) {
        if (curSoldier == null) {
          $scope.ini.soldiers.push(resultSoldier);
        } else {
          angular.copy(resultSoldier, curSoldier);
        }
      });
    };

    this.delSoldier = function(idx) {
      $scope.ini.soldiers.splice(idx, 1);
    };

    this.printName = function (name) {
      if (name == '') {
        return "<random>";
      }
      else {
        return name;
      }
    };
  }]);

  app.controller('SoldierForm', function ($scope, $modalInstance, curSoldier) {

    this.soldier = {};

    if (curSoldier == null) {
      this.soldier = {
        firstName: "",
        lastName: "",
        nickName: "",
        rank: $scope.Ranks[0],
        class: $scope.Classes[0],
        gender: $scope.Genders[0],
        psiRank: $scope.PsiRanks[0],
        country: "",
        classPerks: ["", "", "", "", "", ""],
        psiPerks: ["", "", "", "", "", ""],
        extraPerks: [],
        hp: 0,
        aim: 0,
        will: 0,
        mob: 0,
        defense: 0,
        bonusAttrib: true
      };
    }
    else {
      angular.copy(curSoldier, this.soldier);
      this.curSoldier = curSoldier;
    }


    var frm = this;

    this.submitSoldier = function () {
      $modalInstance.close(this.soldier);
    };

    this.cancel = function() {
      $modalInstance.dismiss('cancel');
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
      for (i = 0; i < 6; ++i) {
        this.soldier.classPerks[i] = "";
      }
    };

    this.isClassDisabled = function () {
      return this.soldier.rank == $scope.Ranks[0];
    };

    this.isPerkDisabled = function (rank) {
      return this.soldier.class == "None" ||
        ($scope.Ranks.indexOf(this.soldier.rank) < $scope.Ranks.indexOf(rank));
    };

    this.isPsiPerkDisabled = function (rank) {
      return this.soldier.psiRank == "None" ||
        ($scope.PsiRanks.indexOf(this.soldier.psiRank) < $scope.PsiRanks.indexOf(rank));
    };

    this.addExtraPerk = function (prk) {
      this.soldier.extraPerks.push(prk);
    };

    this.removeExtraPerk = function (idx) {
      // var idx = this.soldier.extraPerks.indexOf(perk);
      this.soldier.extraPerks.splice(idx, 1);
    };

    this.isExtraPerkInvalid = function (prk) {
      return prk == "" ||
        this.soldier.extraPerks.indexOf(prk) != -1;
    };
  });

  app.directive('perkBox', function () {
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
