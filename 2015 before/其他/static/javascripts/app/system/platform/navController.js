define(["systemApp"], function(app) {
  app.controller("navController", ["$scope", "$state", function($scope, $state) {
      console.log($state.params.auId)
      $scope.navList = [{
        name: "菜单设置",
        sref: "system.platform.menuset({auId:" + $state.params.auId + "})",
        sel: false
      }, {
        name: "关键字自动回复",
        sref: "system.platform.keywordReply({auId:" + $state.params.auId + "})",
        sel: false
      }, {
        name: "微信会员设置",
        sref: "system.platform.memberset({auId:" + $state.params.auId + "})",
        sel: false
      }, {
        name: "欢迎用语设置",
        sref: "system.platform.welcome({auId:" + $state.params.auId + "})",
        sel: false
      }];
      $scope.changeNav = function(o) {
        $scope.navList.forEach(function(io) {
          io.sel = false;
        })
        o.sel = true;
      }
    }])
})
