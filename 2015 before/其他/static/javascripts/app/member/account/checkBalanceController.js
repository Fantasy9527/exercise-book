define(["memberApp", "datetimepicker"],function(app){

  app.filter('cut', function () {
          return function (value, wordwise, max, tail) {
              if (!value) return '';
              max = parseInt(max, 10);
              if (!max) return value;
              if (value.length <= max) return value;

              value = value.substr(0, max);
              if (wordwise) {
                  var lastspace = value.lastIndexOf(' ');
                  if (lastspace != -1) {
                      value = value.substr(0, lastspace);
                  }
              }
              return value + (tail || ' …');
          };
      });
  app.controller("checkBalanceController",["$scope", "$http", "$location", "$document",
      function ($scope, $http, $location, $document) {
        var params;
      //console.log($location.search())
      if ($location.search().hasOwnProperty('page')) {
        params = $location.search();
      } else {
        params = {
          country: 1,
          province: -1,
          city: 0,
          shop: null,
          begin: null,
          end: null,
          memberType: null,
          staff: null,
          saleStaff: null,
          page: 0,
          pageSize: 20
        }
      }

      $location.search(params);
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
          });
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
          getBase();
          getData();
          $scope.shopsData.forEach(function (shop) {
            shop.sel = false;
          });
          $scope.indexShop = obj.name;
          obj.sel = true;
        }
        $scope.refreshShop = function () {
          params.shop = null;
          params.page = 0;
          getBase();
          getData();
          $scope.indexShop = "中国";
          $scope.shopsData = [];
          $scope.cities = false;
          $scope.countryData = angular.copy(res);
          $scope.isMenuOpen = false;
        }
      });


      //下一页
      $scope.pageNext = function (num) {
        params.page = num;
        getData();
      };

      //上一页
      $scope.pagePrevious = function (num) {
          params.page = num;
          getData();
        }
        //跳到当前页面
      $scope.indexPage = function (num) {
        if (num != "...") {
          params.page = num - 1;
          getData();
        }
      }

      getBase();
      getData();

      $scope.otherTime = false;
      $scope.selTime = function (obj) {
        $scope.otherTime = false;
        $scope.daySpans.forEach(function (io) {
          io.sel = false;
        });
        obj.sel = true;
        if (obj.id == 0) {
          $scope.otherTime = true;
        } else {
          params.begin = obj.begin;
          params.end = obj.end;
          getData();
        }
      }
      $scope.selMemberType = function (arr, id) {
        selIndex(arr, id);
        params.memberType = id;
        getData();
      };
      $scope.selSaleStaff = function (arr, id) {
        selStaff(arr, id);
        params.saleStaff = id;
        getData();

      };
      $scope.selStaffs = function (arr, id) {
        selStaff(arr, id);
        params.staff = id;
        getData();
      };

      function selIndex(arr, id) {
        arr.forEach(function (indexArr) {
          indexArr.sel = false;

          //console.log(indexArr.id)
          //console.log(id)
          if (indexArr.id == id) {
            indexArr.sel = true;
          }
          //console.log(indexArr)
        })
      }

      function selStaff(arr, id) {
        arr.forEach(function (indexArr) {
          indexArr.sel = false;
          //console.log(indexArr.staff);
          //console.log(id);
          if (indexArr.staff == id) {
            indexArr.sel = true;
          }
        })
      }


      function paramsState(obj, id) {
        obj.forEach(function (io) {
          io.sel = false;
          if (io.id == id) {
            io.sel = true
          }
        })
      }

      function paramsStaff(obj, id) {
        obj.forEach(function (io) {
          io.sel = false;
          if (io.staff == id) {
            io.sel = true
          }
        })
      }


      function getBase() {
        var all = {
          id: null,
          name: "所有"
        }
        $http.get("/home/brand/" + brandId + "/member/manual/base", {
          params: params
        }).success(function (res) {
          //console.log(res);
          if (!res.saleStaffs) {
            res.saleStaffs = []
          };
          if (!res.staffs) {
            res.staffs = []
          }
          res.memberTypes.unshift(angular.copy(all));
          res.saleStaffs.unshift(angular.copy(all));
          res.staffs.unshift(angular.copy(all));

          $scope.memberTypes = res.memberTypes
          $scope.saleStaffs = res.saleStaffs;
          $scope.staffs = res.staffs;

          paramsState($scope.memberTypes, params.memberType);
          paramsStaff($scope.saleStaffs, params.saleStaff);
          paramsStaff($scope.staffs, params.staff);

        })
      }

      $http.get("/home/brand/" + brandId + "/board/dayspan").success(function (res) {
        var all = {
          id: null,
          name: "不限"
        }
        res.unshift(angular.copy(all));
        //默认选择日期
        var isNotDaySpan = true;
        //如果没有任何日期匹配
        res.forEach(function (io) {
          if (io.begin == params.begin && io.end == params.end) {
            io.sel = true;
            isNotDaySpan = false;
            res[res.length - 1].sel = false;
          } else {
            io.sel = false;
          }
        });
        if (isNotDaySpan) {
          if (params.begin != null) {
            res[res.length - 1].name = params.begin + " ~ " + params.end;
            res[res.length - 1].sel = true;
          } else {
            res[0].sel = true;
          }
        }
        $scope.daySpans = res;
      })



      function getData() {
        $location.search(params);
        $http.get("/home/brand/" + brandId + "/member/manual", {
          params: params
        }).success(function (res) {
          res.memberManuals.forEach(function (io, index) {
            io.No = index + 1 + (res.pages.current * 10)
          })
          $scope.memberManuals = res.memberManuals;

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
          var currentCount = res.pages.current < res.pages.max ? res.pages.pageSize : (res.pages.total - res.pages.current * res.pages.pageSize)
          $scope.pageModel.currentCount = currentCount
          $scope.pageShowing = res.pages.showing;
        })
      }

      $('#beginTime').datetimepicker();
      $('#endTime').datetimepicker();
      $scope.setOtherTime = function () {
        $scope.otherTime = false;
        if (!$scope.otherBegin || !$scope.otherEnd) {
          alert("时间不能为空");
          $scope.daySpans.forEach(function (obj) {
            obj.sel = false;
            if (obj.id == indexTimeId) {
              obj.sel = true;
            }
          })
        } else {
          params.begin = $scope.otherBegin;
          params.end = $scope.otherEnd;
          params.page = 0;
          getData();
          $scope.daySpans[$scope.daySpans.length - 1].name = params.begin + " 至 " + params.end;
        }

      }


      }])
})
