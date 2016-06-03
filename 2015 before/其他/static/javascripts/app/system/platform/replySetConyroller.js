define(["systemApp","popupoverlay"], function(app) {

  //修改规则
  app.controller("replySetConyroller", ["$scope", "$http", "$stateParams", "$rootScope", "$state", function($scope, $http, $stateParams, $rootScope, $state) {
    console.log($stateParams)
    $scope.auId = $stateParams.auId;
    $http.get("/weixin/platform/words/regulation/" + $stateParams.regId + "/auth/" + $stateParams.auId).success(function(res) {
      $scope.regName = res.regName;
      $scope.regText = res.content;
      $scope.tags = res.words.map(function(io) {
        return io.name
      });
    });

    $scope.saveData = function() {
      var data = {
        "tId": $stateParams.tId,
        "regId": $stateParams.regId,
        "regName": $scope.regName,
        "words": $scope.tags.map(function(io) {
          return io.text
        }),
        "text": $scope.regText
      }
      console.log(data);
      $http.post("/weixin/platform/words/regulation/renewal/auth/" + $stateParams.auId, data).success(function(res) {
        $state.go("system.platform.keywordReply", {
          auId: $stateParams.auId
        });
      })
    }


  }])
})
