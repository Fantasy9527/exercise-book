define(["angular", "uiRouter"], function() {
  var app = angular.module('sanyiapp', ['ui.router']);
  app.config(['$stateProvider', "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home").when("", "/home");;
    $stateProvider
      .state("home", {
        url: "/home",
        templateUrl: "/assets/templates/discount/discountHome.html",
        controller: "discountController"
      }).state("exception", {
      url: "/exception/discountPlan/:discountPlan/discountPlanDetail/:discountPlanDetail/subgroup/:subgroup",
      templateUrl: "/assets/templates/discount/discountException.html",
      controller: "discountExceptionController"
    })
  }])
  app.run(["$rootScope", function($rootScope) {
    $rootScope.brandId = brandId;
  }])
  app.controller("discountController", ["$scope", "$http", "$location", "$document", "$rootScope", function($scope, $http, $location, $document, $rootScope) {

    if ($location.search().hasOwnProperty('page')) {
      params = $location.search();
    } else {
      params = {
        country: 1,
        province: -1,
        city: -1,
        shop: -1,
        state: 1,
        page: 0
      }
    }
    $location.search(params);
    $scope.indexShop = "中国";
    $scope.isMenuOpen = false;
    $http.get("/home/brand/" + brandId + "/area/country/1/shops").success(function(res) {
      if (params.shop) {
        res.forEach(function(obj) {
          obj.cities.forEach(function(city) {
            city.shops.forEach(function(shop) {
              if (shop.id == params.shop) {
                $scope.indexShop = shop.name;
              }
            })
          })
        })
      }

      $document.on("click", function(e) {
        $scope.$apply(function() {
          if (e.target == $(".city-plug")[0] || $(".city-plug").has(e.target).length > 0) {
            if (e.target == $(".btn.btn-default.dropdown-toggle")[0] || $(".btn.btn-default.dropdown-toggle").has(e.target).length > 0) {
              $scope.isMenuOpen = !$scope.isMenuOpen;
            }
          } else {
            $scope.isMenuOpen = false;
          }
        })
      })


      $scope.countryData = angular.copy(res);
      $scope.shopsData = [];
      $scope.selCountry = function(obj) {
        $scope.countryData.forEach(function(indexCountry) {
          indexCountry.sel = false;
        });
        obj.sel = true;
        $scope.cities = obj.cities;
        $scope.cities.forEach(function(indexCity) {
          indexCity.sel = false;
        });
        $scope.shopsData.length = 0;
      }
      $scope.selCity = function(obj) {
        $scope.cities.forEach(function(indexCity) {
          indexCity.sel = false;
        });
        //console.log(obj.shops)
        obj.sel = true;
        $scope.indexShop = obj.name;
        $scope.shopsData = angular.copy(obj.shops);
      }
      $scope.selShop = function(obj) {
        $scope.isMenuOpen = false;
        //console.log(obj.id);
        params.shop = obj.id;
        params.page = 0;
        getData();
        $scope.shopsData.forEach(function(shop) {
          shop.sel = false;
        });
        $scope.indexShop = obj.name;
        obj.sel = true;
      }
      $scope.refreshShop = function() {
        params.shop = null;
        params.page = 0;
        getData();
        $scope.indexShop = "中国";
        $scope.shopsData = [];
        $scope.cities = false;
        $scope.countryData = angular.copy(res);
        $scope.isMenuOpen = false;
      }
    });

    getData();
    $scope.isLoding = true;

    function getData() {
      $location.search(params);
      $http({
        method: "get",
        url: "/home/brand/" + brandId + "/discounts",
        cache: true,
        params: params
      }).success(function(res) {
        $scope.isLoding = false;
        $scope.model = res.models;
        $scope.states = res.states;
        $scope.pages = res.pages;

        setTimeout(function() {
          $('.timepicker').datetimepicker();
        }, 1000)


        $scope.states.forEach(function(io) {
          io.sel = false;
          if (io.id == params.state) {
            io.sel = true
          }
        })
        console.log(res);
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
        $scope.pageShowing = res.pages.showing;
      })
    }

    $scope.pageNext = function(num) {
      params.page = num;
      getData();
    };
    $scope.pagePrevious = function(num) {
      params.page = num;
      getData();
    }
    $scope.indexPage = function(num) {
      if (num != "...") {
        params.page = num - 1;
        getData();
      }
    }

    $scope.statesTab = function(x) {
      params.page = 0;
      params.state = x.id;
      getData();
    }

    $scope.newDiscount = function() {
      var json = {
        beginTime: "",
        endTime: "",
        name: "",
        state: 1,
        remark: "",
        isEdit: true,
        isNew: true
      }
      $scope.model.unshift(json);
      setTimeout(function() {
        $('.editing .timepicker').datetimepicker();
      }, 200)
    }

    $scope.edit = function(obj) {
      if (obj.isEdit) return;
      $scope.temp = angular.copy(obj);
      $scope.model.forEach(function(io) {
        io.isEdit = false;
      })
      obj.isEdit = true;
    }

    $scope.save = function(obj, e) {
      $scope.isSaving = true
      e.stopPropagation();
      if (timeContrast(obj.beginTime, obj.endTime)) {
        alert("开始时间不能大于结束时间");
        return
      }
      var url;
      url = "/home/brand/" + brandId + "/discount/" + obj.id;
      if (obj.isNew) {
        url = "/home/brand/" + brandId + "/discount";
      }
      $http.post(url, obj).success(function(res) {
        console.log(res);
        obj.isEdit = false;
        obj.id = res.id;
        $scope.states.forEach(function(io) {
          if (io.id == obj.state) {
            if (obj.isNew) {
              obj._state = {
                name: io.name
              }
            } else {
              obj._state.name = io.name;
            }
          }
        })
        obj.isNew = false;
        $scope.isSaving = false
      }).error(function(error) {
        $scope.isSaving = false
        alert(error.message)
      })
    }
    function timeContrast(a, b) {
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

    $scope.cancel = function(obj, e) {
      e.stopPropagation();
      if (obj.isNew) {
        $scope.model.shift();
        return
      }
      obj.beginTime = $scope.temp.beginTime
      obj.endTime = $scope.temp.endTime
      obj.name = $scope.temp.name
      obj.state = $scope.temp.state
      obj.remark = $scope.temp.remark
      obj.isEdit = false;
    }
    $scope.goSet = function(obj, e) {
      e.stopPropagation();
      location.href = "/home/brand/" + brandId + "/discount/" + obj.id
    }





  }])

  app.controller("discountExceptionController", ["$scope", "$http", "$stateParams", "$state", "$location", "$rootScope", function($scope, $http, $stateParams, $state, $location, $rootScope) {
    $rootScope.hideRetrun = true;
    $scope.isLoading = true;
    getData();
    console.log($stateParams);
    //获取数据
    function getData() {
      $http.get("/home/brand/" + brandId + "/discount/plan/" + $stateParams.discountPlan + "/subgroup/" + $stateParams.subgroup, {
        content: ""
      }).success(function(res) {
        //isEnable  1==>正常  2==>停用
        $scope.isEnable = res.isEnable;
        $scope.selFoodModels = res.besides;
        if (res.besides.length == 0) {
          alert("该类别没有菜品")
          location.href = "/home/brand/" + brandId + "/discount/" + $stateParams.discountPlan + "/detail"
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
          discountPlan: $stateParams.discountPlan, //折扣计划id
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
          discountPlan: $stateParams.discountPlan, //折扣计划id
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
            discountPlan: $stateParams.discountPlan, //折扣计划id
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
