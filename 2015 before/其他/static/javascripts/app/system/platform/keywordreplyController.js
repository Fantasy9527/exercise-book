define(["systemApp", "popupoverlay"], function(app) {

    //获取规则
    app.controller("keywordreplyController", ["$scope", "$rootScope", "$http", "$location", "$state", function($scope, $rootScope, $http, $location, $state) {
        var auId = $state.params.auId;
        $scope.auId = auId;
        $http.get("/weixin/platform/words/regulation/auth/" + auId).success(function(res) {
            $scope.models = res.message;
        })

        $scope.delReg = function(model, index) {
            $http.delete("/weixin/platform/words/remove/regulation/" + model.regId + "/auth/" + model.authId)
                .success(function() {
                    $scope.models.splice(index, 1);
                })
        }

        $scope.skipSet = function(model) {
            $state.go("system.platform.replySet", {
                regId: model.regId,
                auId: auId,
                tId: model.tId
            })
        }
        
    }])
})
