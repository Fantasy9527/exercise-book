define(["systemApp", "popupoverlay"], function(app) {

  //欢迎
  app.controller("welcomeController", ["$scope", "$http", "$stateParams", "$rootScope", "$state", "$timeout", function($scope, $http, $stateParams, $rootScope, $state, $timeout) {
    console.log($stateParams)
    $scope.auId = $stateParams.auId;
    $http.get("/weixin/platform/show/auto/massage/reply/auth/" + $scope.auId).success(function(res) {
      $scope.welcome = res;
      $scope.content = res.content;
      $scope.$watch("content", function(i, y) {
        if ($scope.content.length > 200) {
          $scope.content = $scope.content.slice(0, 200)
        }
      })
    }).error(function(err) {
      $scope.welcome = err;
    })
    $scope.changeDone = false;
    $scope.delDone = false;

    $scope.saveData = function() {
      var data = {
        regId: $scope.welcome.regId,
        tId: $scope.welcome.tId,
        regName: $scope.welcome.regName || "",
        form: 0,
        content: $scope.content
      }
      $http.post("/weixin/platform/renew/auto/massage/reply/auth/" + $scope.auId, data).success(function(res) {
        $scope.changeDone = true;
        $scope.welcome.regId = res.regId;
        $scope.welcome.tId = res.tId;
        $timeout(function() {
          $scope.changeDone = false;
        }, 3000)
      })
    }

    $scope.delData = function() {
      $http.get("/weixin/platform/remove/auto/massage/reply/" + $scope.welcome.regId + "/auth/" + $scope.auId).success(function(res) {
        $scope.welcome.content = "";
        $scope.delDone = true;
        $timeout(function() {
          $scope.delDone = false;
        }, 3000)
      })
    }

  }])
})
