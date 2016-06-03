define(["systemApp"], function(app) {
    app.controller("discount.exceptionController", ["$scope", "$http", "$stateParams", "$state", "$location", "$rootScope", function($scope, $http, $stateParams, $state, $location, $rootScope) {
      $rootScope.hideRetrun = true;
      $scope.isLoading = true;
      getData();

      console.log($state.params.subgroup)
      //获取数据
      function getData() {
        $http.get("/home/brand/" + brandId + "/discount/plan/" + $state.params.discount + "/subgroup/" + $state.params.subgroup, {
          content: ""
        }).success(function(res) {
          //isEnable  1==>正常  2==>停用
          $scope.isEnable = res.isEnable;
          $scope.selFoodModels = res.besides;
          if (res.besides.length == 0) {
            alert("该类别没有菜品");
            $state.go("system.discount.detail",{discount:$state.params.discount});
            return
          }
          $scope.tableName = res.besides[0].groupName + " - " + res.besides[0].subName + "  ";
          $scope.isLoading = false;
        }).error(function(error) {
          /*
                  // alert("餐桌服务费类型不匹配");
                  if (error.state == "failure") {
                    $location.path("/surcharge")
                  }*/
        })
      }

      $scope.addVegetableShow = false;
      $scope.addException = function() {
        $scope.addVegetableShow = !$scope.addVegetableShow;
      }
      $scope.closeVegeTable = function() {
        $scope.addVegetableShow = false;
      }

      $scope.filerGoods = function(e) {
        return e.id == 0;
      }
      $scope.filerGoods2 = function(e) {
        return e.id != 0;
      }



      //添加
      $scope.addVegetableTable = function(obj, e) {
        e.stopPropagation();
        var json = {
          besides: [{
            id: 0,
            discountPlan: $state.params.discount, //折扣计划id
            subgroup: obj.subgroup, // 小类id
            goods: obj.goods, //菜品id
            percentage: 100, // 百分比 可以为空
          }],
          state: $scope.isEnable
        };
        $http.post("/home/brand/" + brandId + "/discount/without/renew", json).success(function(res) {
          obj.id = res.ids[0].wid;

        })
      }

      $scope.save = function(obj, e) {
        e.stopPropagation();
        var json = {
          besides: [{
            id: obj.id,
            discountPlan: $state.params.discount, //折扣计划id
            subgroup: obj.subgroup, // 小类id
            goods: obj.goods, //菜品id
            percentage: obj.percentage, // 百分比 可以为空
          }],
          state: $scope.isEnable
        };
        $http.post("/home/brand/" + brandId + "/discount/without/renew", json).success(function(res) {
          obj.id = res.ids[0].wid;
          obj.isEdit = false;
        })
      }
      $scope.cancel = function(obj, e) {
        e.stopPropagation();
        obj.percentage = $scope.temp.percentage;
        obj.isEdit = false;
      }

      $scope.edit = function(obj) {

        if (obj.isEdit || $scope.isEnable == 2) return;
        $scope.selFoodModels.forEach(function(io) {
          if (io.id != 0) {
            if (io.isEdit) {
              io.percentage = $scope.temp.percentage;
            }
            io.isEdit = false;
          }
        })
        $scope.temp = angular.copy(obj);
        obj.isEdit = true;

      }

      //批量添加
      $scope.batchAdd = function() {
        var arr = [];
        $scope.selFoodModels.forEach(function(io) {
          if (io.id == 0 && io.sel) {
            arr.push({
              id: 0,
              discountPlan: $state.params.discount, //折扣计划id
              subgroup: io.subgroup, // 小类id
              goods: io.goods, //菜品id
              percentage: 100, // 百分比 可以为空
            })
          }
        })
        var json = {
          besides: arr,
          state: $scope.isEnable
        };
        $http.post("/home/brand/" + brandId + "/discount/without/renew", json).success(function(res) {
          $scope.selFoodModels.forEach(function(io) {
            if (io.id == 0 && io.sel) {
              res.ids.forEach(function(ids) {
                if (ids.goods == io.goods) {
                  io.id = ids.wid;
                }
              })
            }
          })
          $scope.addVegetableShow = false;
        })
      }




      $scope.selFoodTable = function(obj) {
        obj.sel = !obj.sel;
      }
      $scope.cheAll = function() {
        $scope.selFoodModels.forEach(function(io) {
          if (io.id == 0) {
            io.sel = $scope.checkall;
          }
        })
      }

      //删除
      $scope.delModel = function(obj, index,e) {
        e.stopPropagation()
        $http.delete("/home/brand/" + brandId + "/discount/plan/" + $scope.isEnable + "/without/" + obj.id).success(function(res) {
          obj.id = 0;
          obj.sel = false;
          //删除菜品
        })
      }




    }])
})
