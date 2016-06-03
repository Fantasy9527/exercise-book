define(["priceApp"], function(app) {
  app.controller("surcharge.exceptionController", ["$scope", "$http", "$stateParams", "$location", function($scope, $http, $stateParams, $location) {
    //console.log($stateParams)
    $scope.addVegetableShow = true;
    //添加按钮
    $scope.addException = function() {
        $scope.addVegetableShow = false;
      }
      //删除
    $scope.delModel = function(obj, index) {
      $http.delete("/home/brand/" + brandId + "/surchares/" + $stateParams.surcharge + "/percentage/" + $stateParams.percentage + "/product/" + obj.product).success(function() {
        $scope.VegetableArr.splice(index, 1);

        //删除菜品
        for (var i = 0; i < $scope.selFoodModels.length; i++) {
          if ($scope.selFoodModels[i].id == obj.id) {
            $scope.selFoodModels[i].sel = false;
            break;
          }

        }

      })
    }
    $scope.isLoading = true;
    getData()
      //获取数据
    function getData() {
      $http.get("/home/brand/" + brandId + "/surchares/" + $stateParams.surcharge + "/percentage/" + $stateParams.percentage).success(function(res) {
        $scope.VegetableArr = res.withoutSurchargeProduct;
        $scope.tableName = res.tableType;
        addDishes();
      }).error(function(error) {
        // alert("餐桌服务费类型不匹配")
        if (error.state == "failure") {
          $location.path("/surcharge")
        }
      })
    }

    //添加菜品
    function addDishes(url, boolean, data) {
      $scope.closeVegeTable = function() {
        $scope.addVegetableShow = !$scope.addVegetableShow;
      }
      var originalUlr = "/home/brand/" + brandId + "/price/" + priceId + "/products";
      if (url) {
        originalUlr = url
      }

      $http.get(originalUlr, {
        cache: true
      }).success(function(res) {
        $scope.isLoading = false;
        $scope.selFoodModelsData = res;
        $scope.groups = res.groups;
        $scope.subgroups = [];
        $scope.selFoodModels = [];
        $scope.selFoodpageIndex = 0;
        var tmp_selFoodModels = [];
        var tmp_AllselFoodModels = [];
        var selFoodPageMax = 0;

        for (var i = 0; i < $scope.selFoodModelsData.models.length; i++) {
          if ($scope.selFoodModelsData.models[i]._product != null) {
            tmp_AllselFoodModels.push({
              unitTypeName: $scope.selFoodModelsData.models[i]._unitType.name,
              name: $scope.selFoodModelsData.models[i].name,
              id: $scope.selFoodModelsData.models[i].id,
              group: returnGroups($scope.selFoodModelsData.models[i].group),
              groupId: $scope.selFoodModelsData.models[i].group,
              subGroup: returnSubGroups($scope.selFoodModelsData.models[i].subgroup),
              subgroupId: $scope.selFoodModelsData.models[i].subgroup,
              product: $scope.selFoodModelsData.models[i]._product.id,
              price: $scope.selFoodModelsData.models[i]._product.price
            })
          }
        }

        initFoodModel();
        //加载全部数据
        function initFoodModel() {
          tmp_selFoodModels = tmp_AllselFoodModels;
          selFoodBtnIsShow();
          tmp_selFoodModels.forEach(function(io) {
            $scope.VegetableArr.forEach(function(vege) {
              if (io.id == vege.id) {
                io.sel = true
              }
            })
          })
          $scope.selFoodModels = tmp_selFoodModels;
        }


        //加载后设置默认value
        $scope.groupsValue = "default";
        $scope.subGroupsValue = "default";
        //大类修改刷新
        $scope.groupsChange = function() {
          $scope.subGroupsValue = "default";
          $scope.subgroups = [];
          $scope.selFoodModels = [];
          $scope.selFoodpageIndex = 0;
          //小类下拉框
          for (var i = 0; i < $scope.selFoodModelsData.subgroups.length; i++) {
            if ($scope.groupsValue == $scope.selFoodModelsData.subgroups[i].group) {
              $scope.subgroups.push($scope.selFoodModelsData.subgroups[i])
            }
          }
          if ($scope.groupsValue == "default") {
            $scope.subgroups = [];
            tmp_selFoodModels = [];
            initFoodModel();
          } else {
            //表格数据
            tmp_selFoodModels = [];

            for (var i = 0; i < tmp_AllselFoodModels.length; i++) {
              if ($scope.groupsValue == tmp_AllselFoodModels[i].groupId) {
                tmp_selFoodModels.push(tmp_AllselFoodModels[i]);
              }
            }
            $scope.selFoodModels = tmp_selFoodModels;
          }
        }

        //小类修改刷新
        $scope.subGroupsChange = function() {
          $scope.selFoodpageIndex = 0;
          tmp_selFoodModels = [];
          //如果选择默认
          if ($scope.subGroupsValue == "default") {
            //tmp_selFoodModels = tmp_AllselFoodModels;
            for (var i = 0; i < tmp_AllselFoodModels.length; i++) {
              if ($scope.groupsValue == tmp_AllselFoodModels[i].groupId) {
                tmp_selFoodModels.push(tmp_AllselFoodModels[i]);

              }
            }

          } else {
            //如果选择有id的小类
            for (var i = 0; i < tmp_AllselFoodModels.length; i++) {
              if ($scope.groupsValue == tmp_AllselFoodModels[i].groupId && $scope.subGroupsValue == tmp_AllselFoodModels[i].subgroupId) {
                tmp_selFoodModels.push(tmp_AllselFoodModels[i]);
              }
            }
          }

          $scope.selFoodModels = tmp_selFoodModels;
        }


        //选择表格
        $scope.selFoodTable = function(index) {
            $scope.selFoodModels[index].sel = !$scope.selFoodModels[index].sel;
            if ($scope.chkAllBtn) {
              $scope.chkAllBtn = false;
            }
          }
          //全选表格
        $scope.selFoodChkAll = function() {
          for (var i = 0; i < $scope.selFoodModels.length; i++) {
            $scope.selFoodModels[i].sel = $scope.chkAllBtn;
          }
        }

        //添加菜品

        $scope.addVegetableTable = function() {
          var VegetableArr = [];


          for (var i = 0; i < tmp_AllselFoodModels.length; i++) {
            //console.log(tmp_AllselFoodModels[i])
            if (tmp_AllselFoodModels[i].sel == true) {

              VegetableArr.push(tmp_AllselFoodModels[i])
            }
          }

          $scope.VegetableArr = VegetableArr;
          var data = {
              "surcharge": $stateParams.surcharge,
              "product": [],
              "percentageId": $stateParams.percentage
            }
            //console.log(VegetableArr)
          data.product = VegetableArr.map(function(io) {
            return io.product
          })
          if (data.product.length == 0) {
            $scope.addVegetableShow = true;
            return;
          }
          $http.post("/home/brand/" + brandId + "/add/without/surchares", data).success(function(res) {
            //console.log(res);
            $scope.addVegetableShow = true;
          })


        }


        //筛选大类数据
        function returnGroups(value) {
          for (var i = 0; i < res.groups.length; i++) {
            if ($scope.selFoodModelsData.groups[i].id == value) {
              return res.groups[i].name
            }
          }
        }

        //筛选小类数据
        function returnSubGroups(value) {
          for (var i = 0; i < res.subgroups.length; i++) {
            if ($scope.selFoodModelsData.subgroups[i].id == value) {
              return res.subgroups[i].name
            }
          }
        }
        //判断按钮是否隐藏
        function selFoodBtnIsShow() {
          if (tmp_selFoodModels.length < 10) {
            $scope.selFoodBtnShow = false
          } else {
            $scope.selFoodBtnShow = true;
          }
        }



      })

    }


  }])

})
