(function () {
  var app = angular.module('barracks', ['ui.bootstrap']);

  app.controller('CustomSoldierCtrl', ['$scope', '$modal', function ($scope, $modal) {
    var ctrl = this;

    this.getBarracksSize = function() {
      var total = $scope.ini.soldiers.length;

      $scope.ini.bulkSoldiers.forEach( function(v) {
        total += v.count;
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

    this.removeBulkSoldiers = function(idx) {
      $scope.ini.bulkSoldiers.splice(idx, 1);
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
        this.soldier = $scope.initSoldier();
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
      if (this.soldier.rank == $scope.Ranks[0].enum) {
        this.soldier.class = $scope.Classes[0].enum;
      }

      var rankIdx = $scope.getRankIndex(this.soldier.rank);
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
      return this.soldier.rank == $scope.Ranks[0].enum;
    };

    this.isPerkDisabled = function (rank) {
      return this.soldier.class == $scope.Classes[0].enum ||
        ($scope.getRankIndex(this.soldier.rank) < $scope.getRankIndex(rank));
        //($scope.Ranks.indexOf(this.soldier.rank) < $scope.Ranks.indexOf(rank));
    };

    this.isPsiPerkDisabled = function (rank) {
      return this.soldier.psiRank == $scope.PsiRanks[0] ||
        ($scope.getPsiRankIndex(this.soldier.psiRank) < $scope.getPsiRankIndex(rank));
        //($scope.PsiRanks.indexOf(this.soldier.psiRank) < $scope.PsiRanks.indexOf(rank));
    };

    this.isOfficerPerkDisabled = function(rank) {
        return this.soldier.officerRank == $scope.OfficerRanks[0] ||
        ($scope.getOfficerRankIndex(this.soldier.officerRank) < $scope.getOfficerRankIndex(rank));
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

  app.controller('BulkSoldierForm', function ($scope) {
    this.soldier = {};

    this.soldier = {
      rank: "eRank_Rookie",
      country: -1,
      gender: "eGender_None",
      count: 1
    };

    this.addSoldiers = function() {
      $scope.ini.bulkSoldiers.push(angular.copy(this.soldier));
      this.soldier.rank = "eRank_Rookie";
      this.soldier.country = -1;
      this.soldier.gender = "eGender_None";
      this.soldier.count = 1;
    }


  });
})();
