define(["shopApp"], function(app) {
  app.controller("correlationController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.isLoding = true;
    var params;
    if ($location.search().page || $location.search() == 0) {
      params = $location.search();
    } else {
      params = {
        group: null,
        subgroup: null,
        page: 0,
        pageSize: 30,
        printingPlan: null
      };
      $location.search(params);
    }

    var Plans;
    getPlan();

    function getPlan() {
      $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/print/goodsType/plan").success(function (res) {
        Plans = angular.copy(res).printings;
        $scope.batchPlans = angular.copy(res).printings;
        //console.log(res)
        $scope.batchPlans.forEach(function (io) {
          io.sel = false;
        })
        var allPlan = {
          id: null,
          name: "所有",
          productType: -1,
          count: 0,
          sel: true
        };
        var nonotPrint = {
          id: 0,
          name: "不打印",
          count: res.notPrintCount.count,
          sel: false

        }

        res.printings.unshift(allPlan);
        res.printings.push(nonotPrint);
        res.printings.forEach(function (group) {
          group.sel = false;
          allPlan.count += group.count;
        });
        res.printings.forEach(function (io) {
          if (params.printingPlan == io.id) {
            io.sel = true
          } else {
            io.sel = false
          }
        })
        $scope.plan = res.printings;
      })
    }
    getCount();

    function getCount() {
      $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/print/goodsType/group", {
        params: params
      }).success(function (res) {
        var allGroup = {
          id: null,
          name: "所有",
          productType: -1,
          count: 0,
          sel: true
        };
        var allsubgroups = {
          id: null,
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
            //console.log(io)
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



    $scope.selPlan = function (obj) {
      $scope.plan.forEach(function (io) {
        io.sel = false;
      })
      obj.sel = true;
      params.printingPlan = obj.id;
      getCount();
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
      if (!obj.allPlan) {
        obj.Plans = angular.copy(Plans);
        obj.Plans.forEach(function (plan) {
          obj.printings.forEach(function (pr) {
            if (pr.id == plan.id) {
              plan.sel = true;
            }
          })
        })
      }
      $scope.goodsData.goodsTypePlans.forEach(function (io) {
        if (io.edit == true) {
          var temp = angular.copy($scope.tmp_data);
          io.edit = false;
          io.group = temp.group;
          io.groupName = temp.groupName;
          io.id = temp.id;
          io.name = temp.name;
          io.allPlan = temp.allPlan;
          io.printings = temp.printings;
          io.subgroup = temp.subgroup;
          io.subgroupName = temp.subgroupName;
        }
      });
      $scope.tmp_data = angular.copy(obj);
      obj.edit = true;
    }

    $scope.cancelEdit = function (obj, e) {
      e.stopPropagation();
      obj.printings = $scope.tmp_data.printings;
      obj.Plans.forEach(function (plan) {
        obj.printings.forEach(function (pr) {
          if (pr.id == plan.id) {
            plan.sel = true;
          }
        })
      })
      obj.edit = false;
    }


    $scope.saveData = function (obj, e) {
      if (e.type == "click" || e.keyCode == 13) {
        //console.log(obj)
        var json = {
          goods: obj.id,
          plans: (function () {
            var arr = [];
            obj.Plans.forEach(function (io) {
              if (io.sel) {
                arr.push(io.id);
              }
            })
            return arr
          })()
        }

        $http.post("/home/brand/" + brandId + "/shop/" + shopId + "/print/goodsType/update", json).success(function (res) {
          var arr = [];
          //console.log(obj.plans)
          obj.Plans.forEach(function (io) {
            if (io.sel) {
              arr.push(io)
            }
          })
          obj.printings = arr;
          obj.edit = false;
        })
      }


    }

    $scope.selAllPlanFn = function () {
      $scope.bathShow = $scope.selAllPlan;
      $scope.goodsData.goodsTypePlans.forEach(function (io) {
        io.sel = $scope.selAllPlan;
      })
    }
    $scope.selThisPlan = function (obj, e) {
      e.stopPropagation();
      var num = 0;
      $scope.goodsData.goodsTypePlans.forEach(function (io) {
        if (io.sel) {
          num++
        }
      })

      if (num > 0) {
        $scope.bathShow = true;
      } else {
        $scope.bathShow = false;
      }
    }
    $scope.isBatchMenuShow = false;
    $scope.batchToogle = function () {
      $scope.isBatchMenuShow = !$scope.isBatchMenuShow;
    }



    $scope.selbatchPlan = function (obj) {
      obj.sel = !obj.sel;
    }

    $scope.batchSetPlan = function () {
      var json = {
        goodses: [],
        plans: []
      }
      var arr = [];
      $scope.goodsData.goodsTypePlans.forEach(function (io) {
        if (io.sel) {
          json.goodses.push(io.id)
        }
      })

      $scope.batchPlans.forEach(function (io) {
        if (io.sel) {
          json.plans.push(io.id);
          arr.push(io)
        }
      })
      $http.post("/home/brand/" + brandId + "/shop/" + shopId + "/print/goodsType/batch", json).success(function () {
        $scope.goodsData.goodsTypePlans.forEach(function (io) {
          if (io.sel) {
            io.printings = arr;
            /*arr.forEach(function(a) {
                //假设没有重复
               var isRepeat = false;
                for (var i = 0; i < io.printings.length; i++) {
                    if (io.printings[i].id == a.id) {
                        //有重复停止本次循环
                        isRepeat=true;
                        break;
                    }
                };
                if(!isRepeat){
                    //没有重复,添加
                    io.printings.push(a)
                }
            })*/

          }
        })
        $scope.isBatchMenuShow = false;
        alert("批量设置成功")
      })

    }

    function getData() {
      $scope.isLoding = false;
      $location.search(params);
      $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/print/goodsTypes", {
        params: params
      }).success(function (res) {
        //console.log(res);
        $scope.selAllPlan = false;
        $scope.bathShow = false;
        $scope.goodsData = res;
        $scope.goodsData.goodsTypePlans.forEach(function (io, index) {
          io.sel = false;
          io.No = params.pageSize * params.page + index + 1
        })
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
