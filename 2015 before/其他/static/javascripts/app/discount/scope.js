define(["angular", "uiRouter"], function () {
  var app = angular.module('sanyiapp', ['ui.router']);
  app.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/scope");
      $stateProvider
        .state("scope", {
          url: "/scope",
          templateUrl: "/assets/templates/discount/scope.html",
          controller: "scopeController"
        })
}])

  
  
  app.run(["$rootScope", function ($rootScope) {
    $rootScope.brandId = brandId;
  }])
  app.controller("scopeController", ["$scope", "$http", "$location", "$document", "$rootScope", function ($scope, $http, $location, $document, $rootScope) {
    $scope.isLoding = true;
    if ($location.search().hasOwnProperty('state')) {
      params = $location.search();
    } else {
      params = {
        country: -1,
        province: -1,
        city: -1,
        shop: -1,
        state: 0 // -1==>所有 0==>适用 1==>未适用
      }
    }
    $location.search(params);
    $scope.indexShop = "中国";
    $scope.isMenuOpen = false;
    $http.get("/home/brand/" + brandId + "/area/country/1/shops").success(function (res) {
      $http.get("/home/brand/" + brandId + "/shop/has/discount/plan/" + discountId).success(function (disShops) {
        $scope.suitableLength = disShops.shops.length;
        $scope.isLoding = false;
        $scope.state=disShops.state;
        console.log(res);
        var shops = [];
        var shopData = angular.copy(res);
        shopData.forEach(function (io) {
          io.cities.forEach(function (city) {
            city.shops.forEach(function (shop) {
              shop.country = io.id;
              shop.countryName = io.name;
              shop.citieName = city.name;
              shops.push(shop);
            })
          })
        })
        shops.forEach(function (shop) {
          shop.isDiscount = 1;
          shop.sel = false;
          disShops.shops.forEach(function (dis) {
            if (dis.shopid == shop.id) {
              shop.isDiscount = 0;
            }
          })
        })
        console.log(shops)
        $scope.shopModel = shops;


        //门店状态
        $scope.states = [{
            name: "所有",
            id: -1,
            len: $scope.shopModel.length
    }, {
            name: "适用",
            id: 0,
            len: $scope.suitableLength
    }, {
            name: "未适用",
            id: 1,
            len: $scope.shopModel.length - $scope.suitableLength
    }]
          //初始化
        $scope.states.forEach(function (io) {
          if (params.state == io.id) {
            io.sel = true;
          }
        })
        
         //初始化该显示的地区
      if (params.shop != -1) {
        shops.forEach(function (io) {
          if (io.id == params.shop) {
            $scope.indexShop = io.name;
          }
        })
      } else if (params.city != -1) {
        shops.forEach(function (io) {
          if (io.city == params.city) {
            $scope.indexShop = io.citieName;
          }
        })
      } else if (params.country != -1) {
        shops.forEach(function (io) {
          if (io.country == params.country) {
            $scope.indexShop = io.countryName;
          }
        })
      }
      })






      $document.on("click", function (e) {
        $scope.$apply(function () {
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
      //选择省
      $scope.selCountry = function (obj) {
          $scope.countryData.forEach(function (indexCountry) {
            indexCountry.sel = false;
          });
          obj.sel = true;
          $scope.cities = obj.cities;
          $scope.indexShop = obj.name;
          $scope.cities.forEach(function (indexCity) {
            indexCity.sel = false;
          });
          $scope.shopsData.length = 0;
          params.country = obj.id;
          params.city = -1;
          params.shop = -1;
          $location.search(params);
        }
        //选择城市
      $scope.selCity = function (obj) {
          $scope.cities.forEach(function (indexCity) {
            indexCity.sel = false;
          });
          //console.log(obj.shops)
          params.city = obj.id;
          params.shop = -1;
          obj.sel = true;
          $scope.indexShop = obj.name;
          $location.search(params);
          $scope.shopsData = angular.copy(obj.shops);
        }
        //选择门店
      $scope.selShop = function (obj) {
          $scope.isMenuOpen = false;
          //console.log(obj.id);
          params.shop = obj.id;
          params.page = 0;
          $location.search(params);
          $scope.shopsData.forEach(function (shop) {
            shop.sel = false;
          });
          $scope.indexShop = obj.name;
          obj.sel = true;

        }
        //还原
      $scope.refreshShop = function () {
        params.shop = -1;
        params.city = -1;
        params.country = -1;
        params.page = 0;
        $scope.indexShop = "中国";
        $scope.shopsData = [];
        $scope.cities = false;
        $scope.countryData = angular.copy(res);
        $scope.isMenuOpen = false;
      }
      $location.search(params);
    });



    //切换
    $scope.statesTab = function (obj) {
      if (obj.sel) return;
      $scope.checkAll = false;
      $scope.states.forEach(function (io) {
        io.sel = false;
      })
      obj.sel = true;
      params.state = obj.id;
      $location.search(params);
    }
//过滤
    $scope.filterShop = function (e) {
      if (params.state == -1) {
        if (params.shop != -1) {
          return e.id == params.shop
        } else if (params.city != -1) {
          return e.city == params.city
        } else if (params.country != -1) {
          return  e.country == params.country
        } else {
          return true
        }
      } else {
        if (params.shop != -1) {
          return (e.isDiscount == params.state) && (e.id == params.shop)
        } else if (params.city != -1) {
          return (e.isDiscount == params.state) && (e.city == params.city)
        } else if (params.country != -1) {
          return (e.isDiscount == params.state) && (e.country == params.country)
        } else {
          return e.isDiscount == params.state
        }

      }
    }

    $scope.checkAllFn = function () {
      $scope.shopModel.forEach(function (io) {
        if (params.state == -1) {
          io.sel = $scope.checkAll;
        } else {
          if (io.isDiscount == params.state) {
            io.sel = $scope.checkAll;
          }
        }
      })
      $scope.batchAddShow = $scope.checkAll;
    }
    $scope.selShopModel = function (obj) {
      if($scope.state==2){return}
        obj.sel = !obj.sel;
        var length = 0;
        $scope.shopModel.forEach(function (io) {
          if (io.sel) {
            length++
          }
        })
        if (length == 0) {
          $scope.batchAddShow = false;
        } else {
          $scope.batchAddShow = true;
        }

      }
      //选择保存
    $scope.save = function (obj, e) {
      e.stopPropagation();
      var json = {
        ids: [obj.id], //门店id
        pId: discountId, // 折扣id,
        state:$scope.state
      };
      $http.post("/home/brand/" + brandId + "/shop/has/discount/add", json).success(function (res) {
        obj.isDiscount = 0;
        $scope.states[1].length++;
        $scope.states[2].length--;
      }).error(function(error){
        alert(error.message)
      })
    }

    $scope.batchSave = function (obj, e) {
      var json = {
        ids: [], //门店id
        pId: discountId, // 折扣id
        state:$scope.state
      };

      $scope.shopModel.forEach(function (io) {
        if (io.sel) {
          json.ids.push(io.id)
        }
      })
      $http.post("/home/brand/" + brandId + "/shop/has/discount/add", json).success(function (res) {
        $scope.shopModel.forEach(function (io) {
          if (io.sel) {
            io.sel = false;
            if (io.isDiscount == 1) {
              $scope.states[1].length++;
              $scope.states[2].length--;
            }
            io.isDiscount = 0;
            $scope.batchAddShow = false;
          }
        })
      }).error(function(error){
        alert(error.message)
      })
    }


    //取消删除
    $scope.cancel = function (obj, e) {
      e.stopPropagation();
      $http.delete("/home/brand/" + brandId + "/shop/" + obj.id + "/has/discount/" + discountId+"/state/"+$scope.state).success(function (res) {
        obj.isDiscount = 1;
        $scope.states[1].length--;
        $scope.states[2].length++;
        $scope.suitableLength++;
      }).error(function(error){
        alert(error.message)
      })
    }




  }])


})