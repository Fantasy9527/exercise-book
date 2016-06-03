define(["systemApp"], function(app) {
  app.controller("platformController", ["$scope", "$rootScope", "$http", function($scope, $rootScope, $http) {
    $scope.auth = function() {
      $http.get("/weixin/platform/auth/brand/" + brandId + "/member/" + $scope.memberType + "/touch").success(function(res) {
        location.href = res;
      })
    }
    $http.get("/weixin/platform/auth/brand/" + brandId + "/index").success(function(res) {
      console.log(res);
      $scope.authList = res.authList;
      $scope.memberTypes = res.memberTypes;
      $scope.memberType = $scope.memberTypes[0].id;
    })
    $scope.isCreate = false;
    $scope.createAuth = function() {
      if ($scope.memberTypes.length == 0) {
        alert("您还未设置会员类型，请尽快设置");
        location.href = "/home/brand/" + brandId + "/member/type";
        return
      }
        $scope.isCreate = true;
      }
      //取消
    $scope.cancelCraete = function() {
      $scope.isCreate = false;
    }
  }])
})
