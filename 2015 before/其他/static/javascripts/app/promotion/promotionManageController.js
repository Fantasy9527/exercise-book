define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
  app.controller('promotionManageController', ["$scope", "$http", "$location", "$document",
    function ($scope, $http, $location, $document) {
      var params;
      //console.log($location.search())
      if ($location.search().hasOwnProperty('page')) {
        params = $location.search();
      } else {
        params = {
          country: 1,
          province: -1,
          city: -1,
          shop: -1,
          state: 1,
          promotiontype: -1,
          service: -1,
          page: 0
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
          getPromotion(params);
          $scope.shopsData.forEach(function (shop) {
            shop.sel = false;
          });
          $scope.indexShop = obj.name;
          obj.sel = true;
        }
        $scope.refreshShop = function () {
          params.shop = null;
          params.page = 0;
          getPromotion(params);
          $scope.indexShop = "中国";
          $scope.shopsData = [];
          $scope.cities = false;
          $scope.countryData = angular.copy(res);
          $scope.isMenuOpen = false;
        }
      });

      getPromotion();
      $scope.isLoding = true;

      function getPromotion() {
        $location.search(params);
        $http({
          method: "get",
          url: "/home/brand/" + brandId + "/promotion/basic",
          cache: true
        }).success(function (data) {
          getQuery(data)
        })
      }

      function getQuery(data) {
        var data = data;
        $http({
          method: "get",
          url: "/home/brand/" + brandId + "/promotion/query",
          params: params
        }).success(function (res) {
          initTable(data, res);
        })
      }

      function initTable(data, res) {
        $scope.isLoding = false;
        $scope.pageData = res.pages;
        var promotionsArr = [];
        for (var i = 0; i < res.promotions.length; i++) {
          promotionsArr.push({
            name: res.promotions[i].name,
            promotionType: res.promotions[i]._promotionType.name,
            state: res.promotions[i]._state.name,
            beginTime: res.promotions[i].beginTime,
            endTime: res.promotions[i].endTime,
            serviceHours: returnServiceHours(data, res.promotions[i].serviceHour),
            week: weekDay(res.promotions[i]),
            id: res.promotions[i].id,
            promotionTypeId: res.promotions[i].promotionType
          })
        }


        $scope.promotionsArr = promotionsArr;
        //按钮是否隐藏
        if (res.pages.max == 0) {
          $scope.paginationPageShow = false;
        } else {
          $scope.paginationPageShow = true;
        }
        var pageArr = [];
        for (var i = 0; i < res.pages.showing.length; i++) {
          if (res.pages.showing[i] != undefined) {
            pageArr.push({
              num: res.pages.showing[i] + 1
            })
          } else {
            pageArr.push({
              num: "..."
            })
          }

        }
        $scope.pageArr = pageArr;

      }

      //返回市别
      function returnServiceHours(data, serviceHours) {
        if (serviceHours) {
          for (var i = 0; i < data.serviceHours.length; i++) {
            if (data.serviceHours[i].id == serviceHours) return data.serviceHours[i].name;
          }
        } else {
          return '全天'
        }
      }

      //拼凑星期
      function weekDay(oWeek) {
        var weekStr = '';
        if (oWeek.sunday) {
          weekStr += '周日 ';
        }
        if (oWeek.monday) {
          weekStr += '周一 ';
        }
        if (oWeek.tuesday) {
          weekStr += '周二 ';
        }
        if (oWeek.wednesday) {
          weekStr += '周三 ';
        }
        if (oWeek.thursday) {
          weekStr += '周四 ';
        }
        if (oWeek.friday) {
          weekStr += '周五 ';
        }
        if (oWeek.saturday) {
          weekStr += '周六 ';
        }
        return weekStr;
      }



      $http({
        method: "get",
        url: "/home/brand/" + brandId + "/promotion/basic",
        cache: true
      }).success(function (data) {
        data.states.forEach(function (io) {
          io.sel = false;
        });
        data.promotionTypes.forEach(function (io) {
          io.sel = false;
        });
        data.serviceHours.forEach(function (io) {
          io.sel = false;
        })

        var serviceAllDay = [{
          beginTime: "00:00:00",
          endTime: "23:59:59",
          id: -1,
          name: "所有",
          remark: "",
          state: -1,
          sel: false
            }, {
          beginTime: "00:00:00",
          endTime: "29:59:59",
          id: null,
          name: "全天",
          remark: "",
          state: null,
          sel: false
            }]

        var promotionTypeAll = {
          id: -1,
          name: "所有",
          sel: false
        }
        var allStates = {
            id: -1,
            name: "所有",
            sel: false
          }
          //状态添加全部
        data.states.splice(0, 0, allStates);
        data.states.forEach(function (io) {
          if (io.id == params.state) {
            io.sel = true;
          }
        })

        $scope.goPromotion = angular.copy(data.promotionTypes);
        //状态添加全部类型
        data.promotionTypes.splice(0, 0, promotionTypeAll);
        data.promotionTypes.forEach(function (promotionType) {
            if (promotionType.id == params.promotiontype) {
              promotionType.sel = true;
            }
          })
          //市别添加所有  全天
        data.serviceHours = serviceAllDay.concat(data.serviceHours);
        data.serviceHours.forEach(function (service) {
          if (service.id == params.service) {
            service.sel = true;
          }
        })
        $scope.promotionData = data;
      })

      $scope.promotionNexPage = function () {
        params.page++;
        if (params.page > $scope.pageData.max) {
          params.page = $scope.pageData.max
        }
        getPromotion();
      }

      $scope.promotionPrePage = function () {
        params.page--;
        if (params.page < 0) {
          params.page = 0;
        }
        getPromotion();
      }

      $scope.promotionBtnPage = function (index) {
        if (index.num == "...") {
          return;
        } else {
          params.page = index.num - 1;
          getPromotion();
        }
      }

      $scope.promotionStatesTab = function (io) {
        params.state = io.id;
        $scope.promotionData.states.forEach(function (index) {
          index.sel = false;
        });
        io.sel = true;
        params.page = 0;
        getPromotion();
      }
      $scope.promotionTypesTab = function (io) {
        params.promotiontype = io.id;
        $scope.promotionData.promotionTypes.forEach(function (index) {
          index.sel = false;
        });
        io.sel = true;
        params.page = 0;
        getPromotion();
      }
      $scope.serviceHoursTab = function (io) {
        params.service = io.id;
        $scope.promotionData.serviceHours.forEach(function (index) {
          index.sel = false;
        });
        io.sel = true;
        params.page = 0;
        getPromotion();
      }

      $scope.stopePromotion = function (obj) {
        var ifDel = confirm("你是否确定停止此活动?");
        if (ifDel == true) {
          $http({
            method: "post",
            url: "/home/brand/" + brandId + "/promotion/stop/" + obj.id
          }).success(function () {
            obj.state = "停用"
          })
        }

      }

    }
])
})
