define(["systemApp","datetimepicker"], function(app) {
  app.controller("discountController", ["$scope", "$http", "$location", "$document", "$rootScope","$state", function($scope, $http, $location, $document, $rootScope,$state) {
$scope.$state=$state;
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
      $state.go("system.discount.detail", {
        discount: obj.id
      })
    }





  }])
})
