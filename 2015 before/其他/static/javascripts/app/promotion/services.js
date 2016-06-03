define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.service("proSrv", function() {
    var _this = this;
    //定价方案
    this.addPrices = function($scope, $http) {
      $http.get("/home/brand/" + brandId + "/prices").success(function(res) {
        $scope.promotioPrices = res.states;
        //console.log(res)
      })
    }
    this.addVegeSubgroups = function($rootScope, $scope, $http, boolean, data) {
      $http.get("/home/brand/" + brandId + "/servicehours").success(function(res) {
        var allDay = [{
          beginTime: "00:00:00",
          endTime: "29:59:59",
          id: null,
          name: "全天",
          remark: "",
          state: 1
        }]

        $scope.servicehours = allDay.concat(res)
      })
      $scope.selServiceHour = null;
      $http.get("/home/brand/" + brandId + "/groups").success(function(res) {
        $scope.selFoodModelsData = res;
        $scope.groups = res.groups;
        $scope.subgroups = res.subgroups;
        $scope.selFoodModels = [];
        var all_selFoodModels = [];
        var tmp_selFoodModels = [];
        var selFoodPageMax = 0;
        $rootScope.all_selFoodModels = [];
        //加载全部数据

        for (var i = 0; i < res.subgroups.length; i++) {
          $rootScope.all_selFoodModels.push({
            groupName: returnGroupName(res.subgroups[i].group),
            groupId: res.subgroups[i].group,
            subGroupName: res.subgroups[i].name,
            subGroupId: res.subgroups[i].id,
            product: res.product,
            _unitType: res._unitType,
            sel: false
          })
        }
        tmp_selFoodModels = $rootScope.all_selFoodModels;
        $scope.selFoodModels = tmp_selFoodModels

        //加载后设置默认value
        $scope.groupsValue = "default";
        //大类修改刷新
        $scope.groupsChange = function() {
          tmp_selFoodModels = [];
          if ($scope.groupsValue == "default") {
            tmp_selFoodModels = $rootScope.all_selFoodModels;
          } else {
            for (var i = 0; i < $rootScope.all_selFoodModels.length; i++) {
              if ($scope.groupsValue == $rootScope.all_selFoodModels[i].groupId) {
                tmp_selFoodModels.push($rootScope.all_selFoodModels[i])
              }
            }

            $scope.selFoodModels = tmp_selFoodModels;

          }


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

        //添加
        $scope.addVegetableTable = function() {
          var VegetableArr = [];
          $scope.addVegetableShow = !$scope.addVegetableShow;
          for (var i = 0; i < $rootScope.all_selFoodModels.length; i++) {
            if ($rootScope.all_selFoodModels[i].sel == true) {
              VegetableArr.push($rootScope.all_selFoodModels[i])
            }
          }
          $scope.VegetableArr = VegetableArr;
        }

        //关闭
        $scope.closeVegetable = function() {
          $scope.addVegetableShow = !$scope.addVegetableShow;
        }

        //删除菜品
        $scope.delVegetableTable = function(id) {
          for (var i = 0; i < $scope.VegetableArr.length; i++) {
            if ($scope.VegetableArr[i].subGroupId == id) {
              $scope.VegetableArr.splice(i, 1)
              break;
            }
          }

          for (var i = 0; i < $rootScope.all_selFoodModels.length; i++) {
            if ($rootScope.all_selFoodModels[i].subGroupId == id) {
              $rootScope.all_selFoodModels[i].sel = false;
              break;
            }

          }
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

        //添加大组名字
        function returnGroupName(id) {
          for (var i = 0; i < res.groups.length; i++) {
            if (id == res.groups[i].id) {
              return res.groups[i].name;
            }
          }

        }


        _this.clearTmp_selFoodModels = function() {
          for (var i = 0; i < tmp_selFoodModels.length; i++) {
            tmp_selFoodModels[i].sel = false;
          }
        }

        //筛选已选中的
        if (boolean == true) {
          var VegetableArr = [];
          // console.log($rootScope)
          data.forEach(function(io) {
            io.subgroups.forEach(function(subgroup) {
              VegetableArr.push({
                groupName: io.groupName,
                groupId: io.group,
                subGroupName: subgroup.subgroupName,
                subGroupId: subgroup.subgroup,
                sel: true
              })
            })
          })

          VegetableArr.forEach(function(io) {
            $rootScope.all_selFoodModels.forEach(function(io2) {
              if (io.subGroupId == io2.subGroupId) {
                io2.sel = true;
              }
            })
          })
          $scope.VegetableArr = VegetableArr;
        }


      })


    }

    //选择门店
    this.selShop = function($scope, $http, filteriVip) {
      var data = null;
      var url = "/home/brand/" + brandId + "/area/country/1/shops";
      if (filteriVip) {
        url = "/home/brand/" + brandId + "/area/country/1/shops?filter=membertype";
      }
      $http.get(url).success(function(res) {
        var initProvinceArr = [];
        data = res;
        for (var i = 0; i < res.length; i++) {
          initProvinceArr.push({
            name: res[i].name,
            id: res[i].id,
          })
        }
        $scope.initProvinceArr = initProvinceArr;
      })

      $scope.ProvinceValue = 0;
      $scope.cityValue = 0;
      $scope.shopValue = 0;

      $scope.selectProvince = function() {
        $scope.cityValue = 0;
        $scope.shopValue = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == $scope.ProvinceValue) {
            $scope.initCityArr = data[i].cities;
            return;
          } else {
            $scope.initCityArr = [];
            $scope.initShopArr = [];

          }
        }
      };

      $scope.selectCity = function() {
        $scope.shopValue = 0;
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].cities.length; j++) {
            if (data[i].cities[j].id == $scope.cityValue) {
              $scope.initShopArr = data[i].cities[j].shops;
              return;
            } else {
              $scope.initShopArr = [];

            }
          }
        }
      }
      $('.datepickerTime').datetimepicker();
    }

    this.selDishes = function($scope, $http) {
      $scope.promotionFood = "default";
      $scope.promotionFoodSub = "default";
      $scope.concretePromotionFood = "default";
      var tmp_selFoodModels = [];
      $http.get("/home/brand/" + brandId + "/price/3/products").success(function(res) {
        $scope.selFoodModelsData = res;
        $scope.DishesGroups = res.groups;
        $scope.DishesSubgroups = res.subgroups;

        initFoodModel();
        //加载全部数据
        function initFoodModel() {
          for (var i = 0; i < $scope.selFoodModelsData.models.length; i++) {
            tmp_selFoodModels.push({
              _unitType: $scope.selFoodModelsData.models[i]._unitType,
              name: $scope.selFoodModelsData.models[i].name,
              id: $scope.selFoodModelsData.models[i].id,
              group: returnGroups($scope.selFoodModelsData.models[i].group),
              groupId: $scope.selFoodModelsData.models[i].group,
              subGroup: returnSubGroups($scope.selFoodModelsData.models[i].subgroup),
              subGroupId: $scope.selFoodModelsData.models[i].subgroup
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
        }
      })


      $scope.selectPromotionFood = function() {
        $scope.promotionFoodSub = "default";
        $scope.concretePromotionFood = "default";
        $scope.DishesSubGroups = [];
        $scope.DishesSubgroups.forEach(function(io) {
            if (io.group == $scope.promotionFood) {
              $scope.DishesSubGroups.push(io)
            }
          })
          // console.log($scope.DishesSubGroups)
      }

      $scope.selectPromotionFoodSub = function() {
        $scope.concretePromotionFood = "default";
        $scope.concreteDishesGroups = [];
        tmp_selFoodModels.forEach(function(io) {
          if (io.subGroupId == $scope.promotionFoodSub) {
            $scope.concreteDishesGroups.push(io)
          }
        })
      }
    }

    /**
     * 添加菜品
     * [function description]
     * @param  {[type]} $scope 作用域
     * @param  {[type]} $http   http服务
     * @param  {[type]} url     获取菜品的url
     * @param  {[type]} boolean 是否是编辑状态
     * @param  {[type]} data    [description]
     * @return {[type]}         [description]
     */
    this.addDishes = function($scope, $http, url, boolean, data) {
      $scope.addVegetableShow = true;
      $scope.closeVegeTable = function() {
        $scope.addVegetableShow = !$scope.addVegetableShow;
      }
      var originalUlr = "/home/brand/" + brandId + "/price/3/products";
      if (url) {
        originalUlr = url
      }

      $http.get(originalUlr).success(function(res) {
        //console.log(res)
        var allDay = [{
          beginTime: "00:00:00",
          brand: 3,
          endTime: "29:59:59",
          id: null,
          name: "全天",
          remark: "",
          state: 1
        }]
        $scope.serviceHours = allDay.concat(res.serviceHours)
        $scope.selFoodModelsData = res;
        $scope.groups = res.groups;
        $scope.subgroups = [];
        $scope.selFoodModels = [];
        $scope.selFoodpageIndex = 0;
        $scope.selFoodBtnShow = true;
        var tmp_selFoodModels = [];
        var tmp_AllselFoodModels = [];
        var selFoodPageMax = 0;


        for (var i = 0; i < $scope.selFoodModelsData.models.length; i++) {
          if ($scope.selFoodModelsData.models[i]._product != null) {
            tmp_AllselFoodModels.push({
              _unitType: $scope.selFoodModelsData.models[i]._unitType,
              name: $scope.selFoodModelsData.models[i].name,
              id: $scope.selFoodModelsData.models[i].id,
              group: returnGroups($scope.selFoodModelsData.models[i].group),
              groupId: $scope.selFoodModelsData.models[i].group,
              subGroup: returnSubGroups($scope.selFoodModelsData.models[i].subgroup),
              subGroupId: $scope.selFoodModelsData.models[i].subgroup,
              product: $scope.selFoodModelsData.models[i]._product.id,
              price: $scope.selFoodModelsData.models[i]._product.price,
              sel: false
            })
          }

        }
        //console.log(tmp_AllselFoodModels)

        initFoodModel();
        //加载全部数据
        function initFoodModel() {
          tmp_selFoodModels = tmp_AllselFoodModels;
          selFoodBtnIsShow();
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
              if ($scope.groupsValue == tmp_AllselFoodModels[i].groupId && $scope.subGroupsValue == tmp_AllselFoodModels[i].subGroupId) {
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
          if ($scope.shopValue == 0 && !boolean) {
            alert("请选择需要参加活动的门店");
            return
          }
          var VegetableArr = [];
          $scope.addVegetableShow = !$scope.addVegetableShow;
          for (var i = 0; i < tmp_AllselFoodModels.length; i++) {
            //console.log(tmp_AllselFoodModels[i])
            if (tmp_AllselFoodModels[i].sel == true) {

              VegetableArr.push(tmp_AllselFoodModels[i])
            }
          }

          $scope.VegetableArr = VegetableArr;
        }


        //删除菜品
        $scope.delVegetableTable = function(id) {
          for (var i = 0; i < $scope.VegetableArr.length; i++) {
            if ($scope.VegetableArr[i].id == id) {
              $scope.VegetableArr.splice(i, 1)
              break;
            }
          }

          for (var i = 0; i < tmp_AllselFoodModels.length; i++) {
            if (tmp_AllselFoodModels[i].id == id) {
              tmp_AllselFoodModels[i].sel = false;
              break;
            }

          }
        }


        /**
         * 编辑状态
         */
        if (boolean) {
          var tmp_VegetableArr = [];
          for (var i = 0; i < data.details.length; i++) {
            // console.log(data)
            tmp_VegetableArr.push({
              _unitType: {
                name: data.details[i].unitTypeName
              },
              id: data.details[i]._goods.id,
              groupId: data.details[i]._goods.group,
              subGroupId: data.details[i]._goods.subgroup,
              product: data.details[i].product,
              vipPrice: data.details[i].price,
              price: data.details[i]._product.price,
              name: data.details[i]._goods.name,
              sel: true
            })
          }
          // console.log(tmp_AllselFoodModels)
          for (var i = 0; i < tmp_VegetableArr.length; i++) {
            for (var j = 0; j < tmp_AllselFoodModels.length; j++) {
              if (tmp_AllselFoodModels[j].id == tmp_VegetableArr[i].id) {
                tmp_AllselFoodModels[j].sel = true;
                tmp_AllselFoodModels[j].vipPrice = tmp_VegetableArr[i].vipPrice
              }

            }
          }
          $scope.VegetableArr = tmp_VegetableArr;
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


      //添加优惠券,清除之前选择的菜品
      _this.clearFoodSel = function() {
        for (var i = 0; i < tmp_selFoodModels.length; i++) {
          tmp_AllselFoodModels[i].sel = false;
        }
      }
    }



    this.addShop = function($scope, $http, callBack) {
      //默认显示关闭
      $scope.addShopShow = false;
      $http.get("/home/brand/" + brandId + "/area/country/1/shops").success(function(res) {
        var initProvinceArr = [];
        for (var i = 0; i < res.length; i++) {
          initProvinceArr.push({
            name: res[i].name,
            id: res[i].id,
          })
        }
        //输出省份数据;
        $scope.initProvinceArr = initProvinceArr;
        //所有数据横向处理;
        $scope.localAllShop = [];
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < res[i].cities.length; j++) {
            for (var k = 0; k < res[i].cities[j].shops.length; k++) {
              $scope.localAllShop.push({
                Province: res[i].name,
                ProvinceId: res[i].id,
                city: res[i].cities[j].name,
                cityId: res[i].cities[j].id,
                shop: res[i].cities[j].shops[k].name,
                shopId: res[i].cities[j].shops[k].id,
                sel: false
              })
            }
          }
        }

        //临时数据
        var tmp_allShop = $scope.localAllShop;
        $scope.allShop = tmp_allShop;

        //选择
        $scope.allShopSel = function(obj) {
            obj.sel = !obj.sel;
          }
          //显示数据初始化
        $scope.alreadyShopData = [];
        //关闭
        $scope.closeShopTable = function() {
            $scope.addShopShow = false;

          }
          //添加数据
        $scope.addShopTable = function() {
          $scope.addShopShow = !$scope.addShopShow;
          tmp_alreadyShopData = [];
          for (var i = 0; i < $scope.localAllShop.length; i++) {
            if ($scope.localAllShop[i].sel == true) {
              tmp_alreadyShopData.push($scope.localAllShop[i]);
            }
          }
          // console.log(tmp_alreadyShopData)
          $scope.alreadyShopData = tmp_alreadyShopData;
        }

        //下拉菜单默认值
        $scope.ProvinceValue = 0;
        $scope.cityValue = 0;
        $scope.shopValue = 0;
        //选择省份
        var ProvinceShopData = [];
        $scope.selectProvince = function() {
          $scope.cityValue = 0;
          $scope.shopValue = 0;
          for (var i = 0; i < res.length; i++) {
            if (res[i].id == $scope.ProvinceValue) {
              $scope.initCityArr = res[i].cities;
              break;
            } else {
              $scope.initCityArr = [];
              $scope.initShopArr = [];

            }
          }
          //console.log($scope.ProvinceValue)
          ProvinceShopData = [];
          if ($scope.ProvinceValue == 0) {
            tmp_allShop = $scope.localAllShop;
            $scope.allShop = tmp_allShop;
            return;
          }
          for (var i = 0; i < $scope.localAllShop.length; i++) {
            if ($scope.ProvinceValue == $scope.localAllShop[i].ProvinceId) {
              ProvinceShopData.push($scope.localAllShop[i])
            }
          }

          tmp_allShop = ProvinceShopData
          $scope.allShop = tmp_allShop;
        }

        //选择城市
        $scope.selectCity = function() {
          //console.log($scope.cityValue)
          var cityShopData = [];
          for (var i = 0; i < $scope.localAllShop.length; i++) {
            if ($scope.ProvinceValue == $scope.localAllShop[i].ProvinceId && $scope.cityValue == $scope.localAllShop[i].cityId) {
              cityShopData.push($scope.localAllShop[i]);
            } else if ($scope.cityValue == 0) {
              //console.log(ProvinceShopData)
              $scope.allShop = ProvinceShopData;
              return;
            }
          }

          tmp_allShop = cityShopData
          $scope.allShop = tmp_allShop;
        }



        $scope.delAlreadyShopData = function(shopId) {
          for (var i = 0; i < $scope.alreadyShopData.length; i++) {
            if ($scope.alreadyShopData[i].shopId == shopId) {
              $scope.alreadyShopData.splice(i, 1);
              break;
            }
          }

          tmp_allShop.forEach(function(io) {
            if (io.shopId == shopId) {
              io.sel = false;
            }
          })
        }

        //全选
        $scope.chkAllShop = function() {
          tmp_allShop.forEach(function(io) {
            io.sel = $scope.allShopCheckBtn;
          });
          $scope.allShop = tmp_allShop;
        }
        if (callBack) {
          callBack()
        }
      })
    }

    this.selTime = function($scope, $http) {
      //自定义时间
      $scope.weekShow = false;
      $scope.weekChecked = "AllWeek";
      $scope.$watch("weekChecked", function() {
        if ($scope.weekChecked == "custom") {
          $scope.weekShow = true;
        } else {
          $scope.weekShow = false;
        }
      })

      $scope.preWeekShow = false;

      $scope.$watch("preweekChecked", function() {
        if ($scope.preweekChecked == "custom") {
          $scope.preWeekShow = true;
        } else {
          $scope.preWeekShow = false;
        }
      })


      var weekType = [{
        type: "preAllWeek",
        name: "周一至周日",
        "monday": "true",
        "tuesday": "true",
        "wednesday": "true",
        "thursday": "true",
        "friday": "true",
        "saturday": "true",
        "sunday": "true"
      }, {
        type: "premanDay",
        name: "周一至周五",
        "monday": "true",
        "tuesday": "true",
        "wednesday": "true",
        "thursday": "true",
        "friday": "true",
        "saturday": "false",
        "sunday": "false"

      }, {
        type: "preweekend",
        name: "周日至周六",
        "monday": "false",
        "tuesday": "false",
        "wednesday": "false",
        "thursday": "false",
        "friday": "false",
        "saturday": "true",
        "sunday": "true"
      }, {
        type: "custom",
        name: "自定义",
        "monday": "false",
        "tuesday": "false",
        "wednesday": "false",
        "thursday": "false",
        "friday": "false",
        "saturday": "true",
        "sunday": "true"
      }];


      $scope.ViewData = [{
        name: "周一至周日",
        data: {
          "monday": "true",
          "tuesday": "true",
          "wednesday": "true",
          "thursday": "true",
          "friday": "true",
          "saturday": "false",
          "sunday": "false"
        },
        value: "allWeek"
      }, {
        name: "周一至周五",
        data: {
          "monday": "true",
          "tuesday": "true",
          "wednesday": "true",
          "thursday": "true",
          "friday": "true",
          "saturday": "false",
          "sunday": "false"
        },
        value: "manDay"
      }, {
        name: "周日至周六",
        data: {
          "monday": "true",
          "tuesday": "true",
          "wednesday": "true",
          "thursday": "true",
          "friday": "true",
          "saturday": "false",
          "sunday": "false"
        },
        value: "weekend"
      }, {
        name: "自定义",
        data: [{
          name: "星期一",
          "monday": "false"
        }, {
          name: "星期二",
          "tuesday": "false"
        }, {
          name: "星期三",
          "wednesday": "false"
        }, {
          name: "星期四",
          "thursday": "false"
        }, {
          name: "星期五",
          "friday": "false"
        }, {
          name: "星期六",
          "saturday": "false"
        }, {
          name: "星期天",
          "sunday": "false"
        }],
        value: "custom"
      }]

    }

    //不参加的时间
    this.nonparticipator = function($scope, $http) {
        $scope.nonparticipatorTimeData = [];
        setTimeout(function() {
          $('.datepickerTime').datetimepicker();
        }, 300)
        $scope.nonparticipator = function() {
          $scope.nonparticipatorTimeData.push({
            beginTime: "",
            endTime: "",
            serviceHour: 0
          })
          setTimeout(function() {
            $('.datepickerTime').datetimepicker();
          }, 300)

        }
        $scope.delNonparticipator = function(index) {
          $scope.nonparticipatorTimeData.splice(index, 1)
        }
      }
      //添加市别
    this.servicehours = function($scope, $http) {
      $http.get("/home/brand/" + brandId + "/servicehours").success(function(res) {
        var allDay = [{
          beginTime: "00:00:00",
          endTime: "29:59:59",
          id: 0,
          name: "全天",
          remark: "",
          state: 1
        }]

        $scope.servicehours = allDay.concat(res);

      })
      $scope.selServicehour = null;
    }


    this.timeContrast = function(a, b) {
      //console.log(a)
      var arr = a.split("-");
      var starttime = new Date(arr[0], arr[1], arr[2]);
      var starttimes = starttime.getTime();

      var arrs = b.split("-");
      var lktime = new Date(arrs[0], arrs[1], arrs[2]);
      var lktimes = lktime.getTime();

      if (starttimes > lktimes) {
        return true;
      } else
        return false;
    }



    this.checkWeek = function(submitData, isVoucher) {
      var isWeekOk = false;
      //是否为代金券
      if (isVoucher) {
        if (
          submitData.dayspan.monday == false &&
          submitData.dayspan.saturday == false &&
          submitData.dayspan.thursday == false &&
          submitData.dayspan.sunday == false &&
          submitData.dayspan.tuesday == false &&
          submitData.dayspan.wednesday == false &&
          submitData.dayspan.friday == false
        ) {
          isWeekOk = true
        }

      } else {
        if (
          submitData.promotion.dayspan.monday == false &&
          submitData.promotion.dayspan.saturday == false &&
          submitData.promotion.dayspan.thursday == false &&
          submitData.promotion.dayspan.sunday == false &&
          submitData.promotion.dayspan.tuesday == false &&
          submitData.promotion.dayspan.wednesday == false &&
          submitData.promotion.dayspan.friday == false
        ) {
          isWeekOk = true
        }
      }


      return isWeekOk;
    }

    this.batchDataChange = function($scope) {
      if ($scope.batchData > 100) {
        $scope.batchData = 100;
      };
      if ($scope.batchData < 0) {
        $scope.batchData = 0;
      }
    }

  })

})
