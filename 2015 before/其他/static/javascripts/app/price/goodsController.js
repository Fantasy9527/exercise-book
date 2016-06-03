define(["priceApp"], function (app) {
  app.controller("goodsController", ["$scope", "$http", "$location", "$timeout", function ($scope, $http, $location, $timeout) {
    var shopId;
    $scope.isLoding = true;
    $http.get("/home/brand/" + brandId + "/pricePlan/" + planId + "/shop").success(function (res) {
      //console.log(res)
      shopId = res.id;
      getCount();
    })
    var params;
    if ($location.search().page || $location.search() == 0) {
      params = $location.search();
    } else {
      params = {
        group: -1,
        subgroup: -1,
        page: 0,
        pageSize: 30,
        hasPricing: 1
          //-1:未定价
          //0:未生效
          //1:生效了
      };
      $location.search(params);
    }




    var serviceHours;
    var temp_price = 0;

    function getCount() {
      $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsType/count", {
        params: params
      }).success(function (res) {
        //console.log(res);
        $scope.toDay = res.today;
        $scope.priceState = [{
            name: "已定价",
            id: 1,
            sel: false,
            count: res.hasEffectedCount
	},
          {
            name: "未生效",
            id: 0,
            sel: false,
            count: res.hasNotEffectedCount
			},
          {
            name: "未定价",
            id: -1,
            sel: false,
            count: res.hasNotPricingCount
	}]

        $scope.priceState.forEach(function (price) {
          price.sel = false;
          if (price.id == params.hasPricing) {
            price.sel = true;
          }
        })


        var allGroup = {
          id: -1,
          name: "所有",
          productType: -1,
          count: 0,
          sel: true
        };
        var allsubgroups = {
          id: -1,
          name: "所有",
          productType: -1,
          count: 0,
          sel: true
        };
        var allDay = {
          beginTime: "10:00:00",
          brand: 3,
          endTime: "16:00:00",
          id: 0,
          name: "全天",
          remark: "",
          state: 1
        }
        res.serviceHours.splice(0, 0, allDay);
        $scope.serviceHours = res.serviceHours;
        res.groups.forEach(function (group) {
          group.sel = false;
          allGroup.count += group.count;
        });
        res.groups.unshift(allGroup);
        res.subgroups.unshift(allsubgroups);
        $scope.groups = res.groups;
        $scope.subgroups = res.subgroups;

        //根据状态,选择相应的选项
        $scope.groups.forEach(function (io) {
          if (io.id == params.group) {
            io.sel = true;
          } else {
            io.sel = false;
          }
        });
        $scope.subgroups.forEach(function (io) {
          if (io.group == params.group) {
            io.show = true;
          } else {
            io.show = false;
          }

          if (io.id == params.subgroup) {
            io.sel = true;
          } else {
            io.sel = false;
          }
        })

        getData();
      })

    }



    $scope.selPriceState = function (obj) {
      $scope.priceState.forEach(function (io) {
        io.sel = false;
      })
      obj.sel = true;
      params.hasPricing = obj.id;
      $scope.pricingState = obj.id
      getCount();
      getData();
    };

    $scope.selGroups = function (obj) {
      $scope.subgroups.forEach(function (io) {
        io.sel = false;
        if (io.group == obj.id) {
          io.show = true;
        } else {
          io.show = false;
        }
      })

      $scope.groups.forEach(function (io) {
        io.sel = false;
      })
      obj.sel = true;
      params.subgroup = null;
      params.group = obj.id;
      params.page = 0;
      getData();
    }

    //选择小类
    $scope.selSubGroups = function (obj) {
      $scope.subgroups.forEach(function (io) {
          io.sel = false;
        })
        //console.log(obj)
      obj.sel = true;
      params.subgroup = obj.id;
      params.page = 0;
      getData();
    }


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


    $scope.editing = function (obj) {
      if (obj.edit) {
        return
      };
      $scope.goodsTypeProducts.forEach(function (io) {
        if (io.edit == true) {
          var temp = angular.copy($scope.tmp_data);
          io.commonProduct = temp.commonProduct;
          io.edit = false;
          io.group = temp.group;
          io.groupName = temp.groupName;
          io.id = temp.id;
          io.name = temp.name;
          io.newPrice = temp.newPrice;
          io.subgroup = temp.subgroup;
          io.subgroupName = temp.subgroupName;
          io.unitTypes = temp.unitTypes;
        }
      });
      $scope.tmp_data = angular.copy(obj);
      obj.edit = true;
      setTimeout(function () {
        $(".editing").find("input").eq(0).trigger("select");
      }, 100)


      if (params.hasPricing != -1) {
        obj.unitTypes.forEach(function (unit) {
          if (unit.newPrice == undefined && unit.product) {
            unit.newPrice = unit.product.price;
          }
        })
      }

      setTimeout(function () {
        $('.editing .datepickerTime').datetimepicker();
      }, 200)
    }

    $scope.cancelEdit = function (obj, e) {
      e.stopPropagation();
      obj.newPrice = $scope.tmp_data.newPrice;
      obj.unitTypes.forEach(function (io) {
        io.newPrice = null
      });
      obj.edit = false;
    }

    $scope.delPrice = function (obj, index) {
      //console.log(obj);
      $http.delete("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsType/" + obj.id).success(function () {
        $scope.goodsTypeProducts.splice(index, 1);
      })
    }

    $scope.saveData = function (obj, e, goodsTypeIndex) {
      if (e.type == "click" || e.keyCode == 13) {
        //console.log(obj)
        var json = {}
        json.unitTypes = [];
        obj.unitTypes.forEach(function (unitType) {
          if (unitType.newPrice) {
            json.unitTypes.push({
              unitType: unitType.unitType,
              newPrice: unitType.newPrice,
              beginTime: obj.commonProduct.beginTime,
              endTime: (function () {
                var str = obj.commonProduct.beginTime;
                return (parseInt(str.substring(0, 4)) + 100) + str.substring(4);
              })(),
              monday: obj.commonProduct.monday,
              tuesday: obj.commonProduct.tuesday,
              wednesday: obj.commonProduct.wednesday,
              thursday: obj.commonProduct.thursday,
              friday: obj.commonProduct.friday,
              saturday: obj.commonProduct.saturday,
              sunday: obj.commonProduct.sunday,
              serviceHour: (function () {
                if (obj.commonProduct.serviceHour == 0) {
                  return null;
                } else {
                  return obj.commonProduct.serviceHour;
                }
              })(),
              selfService: unitType.selfService
            })
          }
        })

        if (!obj.commonProduct.beginTime) {
          alert("您还没有选择生效时间");
          return
        }

        temp_price = json.unitTypes[json.unitTypes.length - 1].newPrice;
        $http.post("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsType/" + obj.id, json).success(function (res) {
          //console.log(res);
          if (e.keyCode == 13) {
            var $Obj = $(".editing").next();
            $timeout(function () {
              $Obj.trigger("click");
              $Obj.find("input").eq(0).trigger("select");
              if ($Obj.find("input").eq(0).val() == "") {
                //$Obj.find("input").eq(0).val(temp_price);
                //console.log($scope.goodsTypeProducts);
                //console.log($scope.goodsTypeProducts[goodsTypeIndex+1]);
                //console.log(goodsTypeIndex)
                $scope.goodsTypeProducts[goodsTypeIndex + 1].unitTypes[0].newPrice = temp_price
              }
            }, 100)
          }

          obj.commonProduct.serviceHourName = (function () {
            for (var i = 0; i < $scope.serviceHours.length; i++) {
              if ($scope.serviceHours[i].id == obj.commonProduct.serviceHour) {
                return $scope.serviceHours[i].name;
              }
            }
          })();
          obj.edit = false;
        }).error(function (res) {
          alert(res.message)
        })
      }
    }


    function getData() {
      $scope.isLoding = false;
      $location.search(params);
      if (params.hasPricing == -1) {
        $scope.newPriceHide = true;
      } else {
        $scope.newPriceHide = false;
      }
      $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsTypes", {
        params: params
      }).success(function (res) {
        if (params.page > res.pages.max) {
          params.page = res.pages.max;
          getData();
        }
        //console.log(res);
        res.goodsTypeProducts.forEach(function (io) {
          io.edit = false;
          io.newPrice = null;
          if (params.hasPricing == -1) {
            io.commonProduct = {
                friday: true,
                monday: true,
                price: null,
                saturday: true,
                sunday: true,
                thursday: true,
                tuesday: true,
                wednesday: true,
                serviceHour: 0,
                beginTime: $scope.toDay
              }
              //如果未定价获取到的数据里,有已经定价了的,那新价格为已经定价的价格
            io.unitTypes.forEach(function (io) {
              if (io.hasOwnProperty("product")) {
                io.newPrice = io.product.price
              }
            })
          }
          //console.log(io);

          //未生效
          for (var i = 0; i < io.unitTypes.length; i++) {
            if (io.unitTypes[i].productChange) {
              io.product = io.unitTypes[i].productChange;
              io.unitTypes[i].product = io.unitTypes[i].productChange;
              io.unitTypes[i].product.price = io.unitTypes[i].productChange.newPrice;
              break
            }
          }

          if (!io.commonProduct.hasOwnProperty("serviceHour")) {
            io.commonProduct.serviceHour = 0;
            io.commonProduct.serviceHourName = "全天"
          } else {
            $scope.serviceHours.forEach(function (serviceHour) {
              if (serviceHour.id == io.commonProduct.serviceHour) {
                io.commonProduct.serviceHourName = serviceHour.name;
              }
            })
          }
        })



        $scope.goodsData = res;
        $scope.goodsTypeProducts = res.goodsTypeProducts;
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



}])
})
