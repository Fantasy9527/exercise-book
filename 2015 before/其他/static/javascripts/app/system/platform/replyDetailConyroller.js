define(["systemApp","popupoverlay"], function(app) {

    //保存规则
    app.controller("replyDetailConyroller", ["$scope", "$http", "$rootScope", "$state", "$location", function($scope, $http, $rootScope, $state) {
      var auId = $state.params.auId;
      $scope.auId = auId;
      $scope.tags = [];
      $scope.loadTags = function(query) {
        /*
            return $http.get('/tags?query=' + query);*/
      };

      $scope.saveData = function() {
        var data = {
          "regName": $scope.regName,
          "words": $scope.tags.map(function(io) {
            return io.text
          }),
          "text": $scope.regText
        }
        console.log(data);
        $http.post("/weixin/platform/words/regulation/save/auth/" + auId, data).success(function(res) {
          $state.go("system.platform.keywordReply", {
            auId: auId
          });
        })
      }


    }])
})
