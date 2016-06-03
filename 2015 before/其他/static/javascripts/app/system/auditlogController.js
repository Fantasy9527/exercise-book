define(["systemApp","datetimepicker"], function(app) {
  app.controller("auditlogController", ["$scope", "$http", "$location", "$stateParams", "$document", function ($scope, $http, $location, $stateParams, $document) {
    var params;
    //console.log($location.search())
    if ($location.search().hasOwnProperty('page')) {
      params = $location.search();
    } else {
      params = {
        shop: -1,
        begin: null,
        end: null,
        page: 0,
        pageSize: 20
      }
    }
    $scope.indexShop = "中国";
    $scope.isMenuOpen = false;
    $http.get("/home/brand/" + brandId + "/area/country/1/shops").success(function (res) {
      if (params.shop) {
        res.forEach(function (obj) {
          obj.cities.forEach(function (city) {
            city.shops.forEach(function (shop) {
              if (shop.id == params.shop) {
                $scope.indexShop = shop.name;
              }
            })
          })
        })
      }

      $document.on("click", function (e) {
        $scope.$apply(function () {
          if (e.target == $(".city-plug")[0] || $(".city-plug").has(e.target).length > 0) {
            //console.log("点到了")
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
      $scope.selCountry = function (obj) {
        $scope.countryData.forEach(function (indexCountry) {
          indexCountry.sel = false;
        });
        obj.sel = true;
        $scope.cities = obj.cities;
        $scope.cities.forEach(function (indexCity) {
          indexCity.sel = false;
        })
        $scope.shopsData.length = 0;
      }
      $scope.selCity = function (obj) {
        $scope.cities.forEach(function (indexCity) {
          indexCity.sel = false;
        });
        //console.log(obj.shops)
        obj.sel = true;
        $scope.indexShop = obj.name;
        $scope.shopsData = angular.copy(obj.shops);
      }
      $scope.selShop = function (obj) {
        $scope.isMenuOpen = false;
        //console.log(obj.id);
        params.shop = obj.id;
        getAuditlog(params);
        $scope.shopsData.forEach(function (shop) {
          shop.sel = false;
        });
        $scope.indexShop = obj.name;
        obj.sel = true;
      }
      $scope.refreshShop = function () {
        params.shop = null;
        params.page = 0;
        getAuditlog(params);
        $scope.indexShop = "中国";
        $scope.shopsData = [];
        $scope.cities = false;
        $scope.countryData = angular.copy(res);
      }
    });


    $scope.otherTime = false;
    $('#beginTime').datetimepicker();
    $('#endTime').datetimepicker();
    $http.get("/home/brand/" + brandId + "/board/dayspan").success(function (dayspan) {
      var noTime = {
        begin: null,
        end: null,
        id: -1,
        name: "所有时间"
      }
      dayspan.unshift(noTime)
      $scope.dayspan = dayspan;

      if (params.begin == null && params.end == null) {
        $scope.dayspan[0].sel = true;
      } else {
        var isOther=true;
        for(var i=0;i<$scope.dayspan.length;i++){
           $scope.dayspan[i].sel = false;
          if ($scope.dayspan[i].begin == params.begin && $scope.dayspan[i].end == params.end) {
            $scope.dayspan[i].sel = true;
            isOther=false;
            return;
          }
        }
        if(isOther){
          var otherDay=$scope.dayspan[$scope.dayspan.length-1];
          otherDay.name=params.begin+" ~ "+params.end;
          otherDay.sel=true
        }

      }

    });
    var indexTimeId;
    $scope.timeset = function (time) {
      if (time.id == 0) {
        $scope.otherTime = true;
      } else {
        indexTimeId = time.id;
        $scope.otherTime = false;
        params.begin = time.begin;
        params.end = time.end;
        params.page = 0;
        getAuditlog(params);
        $scope.dayspan[$scope.dayspan.length-1].name="自定义"
      }
      $scope.dayspan.forEach(function (obj) {
        obj.sel = false;
      })
      time.sel = true;
    }

    $scope.setOtherTime = function () {
      $scope.otherTime = false;
      if (!$scope.otherBegin || !$scope.otherEnd) {
        alert("时间不能为空");
        $scope.dayspan.forEach(function (obj) {
          obj.sel = false;
          if (obj.id == indexTimeId) {
            obj.sel = true;
          }
        })
      } else {
        params.begin = $scope.otherBegin;
        params.end = $scope.otherEnd;
        params.page = 0;
        getAuditlog(params);
        $scope.dayspan[$scope.dayspan.length - 1].name = params.begin + " 至 " + params.end;
      }

    }

    getAuditlog(params);
    $scope.pageNext = function (num) {
      params.page = num;
      getAuditlog(params);
    };
    $scope.pagePrevious = function (num) {
      params.page = num;
      getAuditlog(params);
    }
    $scope.indexPage = function (num) {
      if (num != "...") {
        params.page = num - 1;
        getAuditlog(params);
      }
    }

    function getAuditlog(audit) {
      $location.search(audit)
      $http.get("/home/brand/" + brandId +"/auditlogs",{params:audit}).success(function (auditlogs) {
        for (var i = 0; i < auditlogs.pages.showing.length; i++) {
          if (auditlogs.pages.showing[i] == null) {
            auditlogs.pages.showing[i] = {
              name: "..."
            }
          } else {
            auditlogs.pages.showing[i] = {
              name: auditlogs.pages.showing[i] + 1
            }
          }
        }
        $scope.pageShowing = auditlogs.pages.showing;
        $scope.auditlogData = auditlogs;
      })
    }
  }])
})
