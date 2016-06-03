define(["memberApp", "tool"], function(app) {
    app.controller('balanceStateController', ['$scope', '$http', '$stateParams', '$location', function($scope, $http, $stateParams, $location) {
        $scope.id = $stateParams.id;
        var params;
        //console.log($location.search())
        if ($location.search().hasOwnProperty('page')) {
            params = $location.search();
        } else {
            params = {
                page: 0,
                pageSize: 20
            }
        }
        getData();

        function getData() {
            $http.get("/home/brand/" + brandId + "/member/type/" + $stateParams.id + "/stat/balance", {
                params: params
            }).success(function(res) {
                $location.search(params);
                $scope.model = res.balanceChanges;
                for (var i = 0; i < res.pages.showing.length; i++) {
                    if (res.pages.showing[i] == null) {
                        res.pages.showing[i] = {
                            name: "..."
                        }
                    } else {
                        res.pages.showing[i] = {
                            name: res.pages.showing[i] + 1
                        }
                    }
                }
                $scope.pageModel = res.pages;
                $scope.pageShowing = res.pages.showing;
            })
        }

        $scope.formatMoney = function(money) {
            return formatMoney(money)
        }

        //下一页
        $scope.pageNext = function(num) {
            params.page = num;
            getData();
        };

        //上一页
        $scope.pagePrevious = function(num) {
                params.page = num;
                getData();
            }
            //跳到当前页面
        $scope.indexPage = function(num) {
            if (num != "...") {
                params.page = num - 1;
                getData();
            }
        }

    }])
})
