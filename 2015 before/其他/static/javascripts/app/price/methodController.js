define(["priceApp"], function (app) {
  app.controller("methodController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    var shopId;
    var params;
    $scope.isLoding=true;
    $http.get("/home/brand/" + brandId + "/pricePlan/" + planId + "/shop").success(function (res) {
      //console.log(res)
      shopId = res.id;
      getCount();
      getData();
    })

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


    function getCount() {
      if (params.hasPricing == -1) {
        $scope.newPriceHide = true;
      } else {
        $scope.newPriceHide = false;
      }
      $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsMethod/count", {
        params: params
      }).success(function (res) {
        $scope.isLoding=false;
        $scope.priceState = [{
            name: "已定价",
            id: 1,
            sel: false,
            count: res.hasEffectedCount
	},
				/*{
					name: "未生效",
					id: 0,
					sel: false,
					count: res.hasNotEffectedCount
			},*/
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
          //console.log(res);
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

      })



    }



    $scope.selPriceState = function (obj) {
      $scope.priceState.forEach(function (io) {
        io.sel = false;
      })
      obj.sel = true;
      params.hasPricing = obj.id;
      getCount()
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
      $scope.models.forEach(function (io) {
        io.edit = false;
      })
      $scope.tmp_data = angular.copy(obj);
      obj.edit = true;
      setTimeout(function () {
        $(".editing").find("input").eq(0).trigger("select");
      }, 100)

    }

    $scope.cancelEdit = function (obj, e) {
      e.stopPropagation();
      obj.newPrice = $scope.tmp_data.newPrice;

      obj.edit = false;
    }

    $scope.delPrice = function (obj, index) {
      $http.delete("/home/brand/" + brandId + "/shop/" + shopId + "/product/goods/" + obj.goods.id + "/remove").success(function () {
        obj.newPrice = "";
        obj.goods.price = "";
        obj.edit = false;
        $scope.models.splice(index, 1)
      })



    }

    $scope.saveData = function (obj, e) {

      if (e.type == "click" || e.keyCode == 13) {
        var json = {
          goods: obj.goods.id,
          newPrice: obj.newPrice,
          beginTime: "2015-08-08",
          endTime: "2115-08-08",
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
          serviceHour: null
        }
        if (obj.product) {
          $http.post("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsMethod/update   ", json).success(function (res) {
            //console.log(res);
            if (e.keyCode == 13) {
              var $Obj = $(".editing").next();
              setTimeout(function () {
                $Obj.trigger("click");
                $Obj.find("input").eq(0).trigger("select");
              }, 100)

            }
            obj.edit = false;
          })
        } else {
          $http.post("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsMethod/add   ", json).success(function (res) {
            //console.log(res);
            if (e.keyCode == 13) {
              var $Obj = $(".editing").next();
              setTimeout(function () {
                $Obj.trigger("click");
                $Obj.find("input").eq(0).trigger("select");
              }, 100)

            }
            obj.edit = false;
          })
        }
      }


    }



    function getData() {

      $location.search(params);
      $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/product/goodsMethods", {
        params: params
      }).success(function (res) {
        //console.log(res);
        res.models.forEach(function (io) {
          io.edit = false;
          io.newPrice = null;
        })

        $scope.goodsData = res;
        $scope.models = res.models;
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
