define(["systemApp","datetimepicker","popupoverlay"], function(app) {
  app.controller("statManageController", ["$scope", "$http", "$location", "$document", "$rootScope", function ($scope, $http, $location, $document, $rootScope) {
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

      $scope.isLoding = false;
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

      console.log(shops)
      $scope.shopModel = shops;


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
      //
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
        $location.search(params);
      }

    });



    //过滤
    $scope.filterShop = function (e) {
      if (params.shop != -1) {
        return e.id == params.shop
      } else if (params.city != -1) {
        return e.city == params.city
      } else if (params.country != -1) {
        return e.country == params.country
      } else {
        return true
      }
    }
    $('.timepicker').datetimepicker();
    $('#lightCustomModal').popup({
      //pagecontainer: '.container',
      transition: 'all 0.3s'
    });

    $scope.timeChange=function(){
      if(!!$scope.beginTime&&!!$scope.endTime){
        compareTime($scope.beginTime,$scope.endTime)
      }
    }


    function compareTime(begin,end){
     begin=begin.replace(/-/g,"");
     end=end.replace(/-/g,"");
     if(begin>end){
       $scope.isBefore=true;
     }else{
       $scope.isBefore=false;
     }
    }

    $scope.manage = function (obj) {
      $('#removeData').modal();
      $scope.indexWillDelShopName = obj.name;
      $scope.delete = function () {
        $http.delete("/home/brand/" + brandId + "/shop/" + obj.id + "/stat/delete", {
          params: {
            begin: $scope.beginTime,
            end: $scope.endTime
          }
        }).success(function (res) {
          $('#removeData').modal("hide");
          alert("删除成功")
        })
      }

    }





  }])
})
