define(["shopApp"], function(app) {

    app.controller('managersController', function($scope, $http, $timeout) {
        var getTermUrl = '/home/brand/' + brandId + '/shop/' + shopId + '/team'
        $http.get(getTermUrl).success(function(data) {
            $scope.model = data;
            $scope.tempModel = JSON.parse(JSON.stringify($scope.model));
        })

        $scope.showEditTeam = -1;

        $scope.editTeam = function() {
            $scope.showEditTeam = 1;
        }
        $scope.saveModel = function() {
            var url = '/home/brand/' + brandId + '/shop/' + shopId + '/team';
            var postModel = {}
            postModel.name = $scope.model.shopManager.name;
            postModel.remark = $scope.model.shopManager.remark;
            $http.post(url, postModel).success(function(data) {
                $scope.model.shopManager = data;
                $scope.showEditTeam = -1;
            })
        }

        $scope.cancelModel = function() {
            $scope.model = JSON.parse(JSON.stringify($scope.tempModel));
            $scope.showEditTeam = -1;
        }

        $scope.cancelQueryModel = function() {
            $scope.queryModel = {};
            $scope.showAddModel = -1;
            $scope.showQueryModel = -1;
        }

        $scope.showAddModel = -1;
        $scope.addManager = function() {
            $scope.showAddModel = 1;
        }

        $scope.queryModel = {};
        $scope.saveQueryModel = function() {
            var isContain = false;
            $scope.model.managers.forEach(function(manager) {
                if (manager.email == $scope.queryModel.account || manager.mobile == $scope.queryModel.account) {
                    alert("当前群组中已包含" + manager.email);
                    isContain = true;
                    return;
                }
            })
            if (isContain == false) {
                var checkEmail = {};

                checkEmail.account = $scope.queryModel.account;
                var url = '/home/brand/' + brandId + '/shop/' + shopId + '/checkEmail'
                $http.post(url, checkEmail).success(function(data) {
                    if (data.message != undefined && 　data.message == false) {
                        $scope.showAddModel = 3;
                        if ($scope.queryModel.account.indexOf("@") != -1) {
                            $scope.addModel.email = $scope.queryModel.account;
                            $scope.addReadonly = "email";
                        } else {
                            $scope.addModel.mobile = $scope.queryModel.account;
                            $scope.addReadonly = "mobile";
                        }
                    } else {
                        $scope.showAddModel = 2;
                        $scope.existModel = data.message;
                    }
                })
            }
        }

        $scope.showAddModel = -1;
        $scope.addModel = {};
        $scope.saveAddModel = function() {
            var url = '/home/brand/' + brandId + '/shop/' + shopId + '/manager'
            var postModel = $scope.addModel;
            var mailReg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
            var phoneReg = /0?(13|14|15|17|18)[0-9]{9}/;

            if (!mailReg.test($scope.addModel.email)) {
                alert("请输入正确的邮箱");
                return;
            }
            if (!phoneReg.test($scope.addModel.mobile)) {
                alert("请输入正确的手机号码");
                return;
            }
            if ($scope.addModel.name == undefined) {
                alert("名字不能为空");
                return;
            }
            if ($scope.addModel.name == "") {
                alert("名字不能为空");
                return;
            }
            if ($scope.addModel.name.length > 6) {
                alert("名字不能大于6个字");
                return;
            }
            if ($scope.addModel.password == undefined) {
                alert("密码不能为空");
                return;
            }
            if ($scope.addModel.password == "") {
                alert("密码不能为空");
                return;
            }
            if ($scope.addModel.password.length < 6) {
                alert("密码不能小于6位");
                return;
            }
            if ($scope.addModel.password.length > 18) {
                alert("密码不能大于18位");
                return;
            }

            postModel.accept = true;
            $http.post(url, postModel).success(function(data) {
                $scope.showAddModel = -1;
                $scope.showQueryModel = -1;
                var managers = $scope.model.managers;
                managers.push(data.mgr);
                $scope.queryModel = {};
            }).error(function(err) {
                alert(err.message)
            })
        }

        $scope.saveExistModel = function() {
            var url = '/home/brand/' + brandId + '/shop/' + shopId + '/manager/exsit'
            var postModel = $scope.existModel;
            var addModel = JSON.parse(JSON.stringify(postModel));
            postModel.role = $scope.model.shopManager.id;
            postModel.manager = postModel.id;
            postModel.brand = brandId;
            $http.post(url, postModel).success(function(data) {
                if (data == true) {
                    $scope.showAddModel = -1;
                    $scope.showQueryModel = -1;
                    var managers = $scope.model.managers;
                    managers.push(addModel);
                    $scope.queryModel = {};
                }
            })
        }

        $scope.removeManager = function(managerid) {
            var url = '/home/brand/' + brandId + '/shop/' + shopId + '/manager/' + managerid + '/remove';
            $http.delete(url).success(function(data) {
                if (data == true) {
                    var managers = $scope.model.managers;
                    for (var i = 0; i < managers.length; i++) {
                        if (managers[i].id == managerid) {
                            managers.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
            })
        }
    })

})
