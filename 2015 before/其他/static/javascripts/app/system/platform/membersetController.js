define(["systemApp", "popupoverlay"], function(app) { //会员设置
    app.controller("membersetController", ["$scope", "$http", "$state", function($scope, $http, $state) {
        var auId = $state.params.auId;
        //获取所有会员类型
        $http.get("/weixin/platform/brand/" + brandId + "/member/type/show").success(function(all) {
            //获取已经添加了的会员类型
            $http.get("/weixin/platform/auth/" + auId + "/brand/" + brandId + "/memtype/show").success(function(current) {
                all.memberTypes.forEach(function(m) {
                    current.memberTypes.forEach(function(m2) {
                        m2.id = m2.memberTypeId;
                        if (m.id == m2.memberTypeId) {
                            m.isDefault = m2.isDefault;
                            m.customId = m2.customId;
                        }
                    })
                })
                $scope.currentMemberTypes = current.memberTypes;
                $scope.memberTypes = all.memberTypes;
            })
        })
        $scope.addMemberShow = false;
        //打开添加
        $scope.addMemberTable = function() {
                $scope.addMemberShow = !$scope.addMemberShow;
            }
            //关闭添加
        $scope.closeTable = function() {
            $scope.addMemberShow = false;
        }

        //添加会员
        $scope.addMember = function(obj, index) {
            var data = {
                authId: auId,
                memberTypeId: obj.id
            };
            $http.post("/weixin/platform/auth/brand/" + brandId + "/member/type/save", data).success(function(res) {
                obj.isDefault = 0;
                obj.customId = res.customId;
                //obj.memberTypeId = obj.id;
                $scope.currentMemberTypes.push(obj);
                $scope.memberTypes.splice(index, 1);
            }).error(function(err) {
                alert(err.err)
            })
        }


        //删除数据
        $scope.delData = function(obj, index) {
            $http.delete("/weixin/platform/auth/brand/" + brandId + "/memtype/" + obj.customId).success(function(res) {
                $scope.currentMemberTypes.splice(index, 1);
                delete obj.isDefault
                $scope.memberTypes.push(obj);
            })
        }

        //设置默认
        $scope.setDefault = function(obj) {
            $http.get("/weixin/platform/auth/" + auId + "/membertype/" + obj.id + "/brand/" + brandId + "/set ").success(function() {
                $scope.currentMemberTypes.forEach(function(o) {
                    o.isDefault = 0;
                })
                obj.isDefault = 1;
            })
        }

    }])
})
