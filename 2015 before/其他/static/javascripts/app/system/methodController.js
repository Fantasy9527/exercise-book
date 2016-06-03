define(["systemApp"], function(app) {
  app.controller("methodController", ["$rootScope", '$scope', '$http', '$location', '$timeout',
    function($rootScope, $scope, $http, $location, $timeout) {
      $scope.brandId = brandId
      var params;
      if ($location.search().page || $location.search() == 0) {
        params = $location.search();
      } else {
        params = {
          group: null,
          subgroup: null,
          page: 0
        };
        $location.search(params);
      }

      var groups, subgroups;
      $http.get("/home/brand/" + brandId + "/goods/methods/groups").success(function(res) {
        //console.log(res);
        groups = angular.copy(res.groups);
        subgroups = angular.copy(res.subgroups);
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
        res.groups.forEach(function(group) {
          group.sel = false;
          allGroup.count += group.count;
        });
        res.groups.unshift(allGroup);
        res.subgroups.unshift(allsubgroups);
        $scope.groups = res.groups;
        $scope.subgroups = res.subgroups;
        getGoods();
      })


      //选择大类
      $scope.selGroups = function(obj) {
        $scope.subgroups.forEach(function(io) {
          io.sel = false;
          if (io.group == obj.id) {
            io.show = true;
          } else {
            io.show = false;
          }
        })

        $scope.groups.forEach(function(io) {
          io.sel = false;
        })
        obj.sel = true;
        params.subgroup = null;
        params.group = obj.id;
        params.page = 0;
        getGoods();
      }

      //选择小类
      $scope.selSubGroups = function(obj) {
        $scope.subgroups.forEach(function(io) {
          io.sel = false;
        })
        obj.sel = true;
        params.subgroup = obj.id;
        params.page = 0;
        getGoods();
      }

      function getGoods() {
        $location.search(params);
        $http.get("/home/brand/" + brandId + "/goods/methods", {
          params: params
        }).success(function(res) {
          res.goodsMethods.forEach(function(io) {
            io.edit = false;
            io.add = false;
            io.allGroups = angular.copy(groups);
            io.allSubGroups = angular.copy(subgroups);
            io.subGroups = (function() {
              var arr = [];
              io.allSubGroups.forEach(function(subgroup) {
                if (subgroup.group == io.group) {
                  arr.push(subgroup);
                }
              })
              return arr;
            })();


            io.groupName = (function() {
              for (var i = 0; i < io.allSubGroups.length; i++) {
                if (io.allSubGroups[i].id == io.subgroup) {
                  return io.allSubGroups[i].name
                }
              }
            })();

            io.subgroupName = (function() {
              for (var i = 0; i < io.allSubGroups.length; i++) {
                if (io.allSubGroups[i].id == io.subgroup) {
                  return io.allSubGroups[i].name
                }
              }
            })();

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
          $scope.methodData = res.goodsMethods;
          $scope.pageShowing = res.pages.showing;
          $scope.goodsData = res;
        })

      }

      //下一页
      $scope.pageNext = function(num) {
        params.page = num;
        getGoods();
      };

      //上一页
      $scope.pagePrevious = function(num) {
          params.page = num;
          getGoods();
        }
        //跳到当前页面
      $scope.indexPage = function(num) {
        if (num != "...") {
          params.page = num - 1;
          getGoods();
        }
      }


      //添加菜品
      $scope.addMethod = function() {
        for (var i = 0; i < $scope.methodData.length; i++) {
          if ($scope.methodData[i].add) {
            return
          }
        }
        //还原恢复状态
        $scope.methodData.forEach(function(io, index) {
          if (io.edit) {
            $scope.methodData[index] = tempMehod;
          }
          io.edit = false;
        })
        newMethodData = {
            name: "",
            group: angular.copy(groups)[0].id,
            subgroup: returnSubGroups()[0].id,
            remark: "",
            edit: true,
            add: true,
            allGroups: angular.copy(groups),
            allSubGroups: angular.copy(subgroups),
            subGroups: returnSubGroups(),
            productType: 7,
            unitType: 1,
            spicyLevel: 0
          }
          //console.log(newMethodData)
        $scope.methodData.unshift(newMethodData);
        setTimeout(function() {
          $(".editing").find("input").eq(0).trigger("select");
        }, 100)
      }

      function returnSubGroups() {
        var tamp_subgroup = angular.copy(subgroups);
        var arr = [];
        tamp_subgroup.forEach(function(io) {
          if (io.group == angular.copy(groups)[0].id) {
            arr.push(io)
          }
        })
        return arr;
      }






      var tempMehod;
      $scope.editing = function(obj) {
        tempMehod = angular.copy(obj);
        $scope.methodData.forEach(function(io) {
          if (io.edit) {
            io.group = tempMehod.group;
            io.groupName = tempMehod.groupName;
            io.name = tempMehod.name;
            io.subgroup = tempMehod.subgroup;
            io.subgroupName = tempMehod.subgroupName;
            io.remark = tempMehod.remark;
          }
          io.edit = false;
        })
        obj.edit = true;
      }

      $scope.cancelEdit = function(obj, e) {
        e.stopPropagation();
        //console.log(tempMehod);
        if (obj.add) {
          $scope.methodData.splice(0, 1);
        } else {
          obj.group = tempMehod.group;
          obj.groupName = tempMehod.groupName;
          obj.name = tempMehod.name;
          obj.subgroup = tempMehod.subgroup;
          obj.subgroupName = tempMehod.subgroupName;
          obj.remark = tempMehod.remark;
          obj.edit = false;
        }

      }
      $scope.saveMethod = function(obj, e) {
        e.stopPropagation();
        if (e.type == "click" || e.keyCode == 13) {
          if (obj.name == "") {
            obj.nameError = true;
          } else {
            obj.nameError = false;
            if (obj.add) {
              $http.post("/home/brand/" + brandId + "/goods", obj).success(function(res) {
                obj.edit = false;
                obj.add = false;
                obj.id = res.id;
                obj.groupName = (function() {
                  for (var i = 0; i < obj.allSubGroups.length; i++) {
                    if (obj.allSubGroups[i].id == obj.subgroup) {
                      return obj.allSubGroups[i].name
                    }
                  }
                })();

                obj.subgroupName = (function() {
                  for (var i = 0; i < obj.allSubGroups.length; i++) {
                    if (obj.allSubGroups[i].id == obj.subgroup) {
                      return obj.allSubGroups[i].name
                    }
                  }
                })();

              }).error(function(error) {
                alert(error.message)
              })
            } else {
              $http.post("/home/brand/" + brandId + "/goods/" + obj.id, obj).success(function(res) {
                obj.edit = false;
              }).error(function(error) {
                alert(error.message)
              })

            }
          }
        }
      }

      $scope.delMethod = function(obj, index) {
        $http.delete("/home/brand/" + brandId + "/goods/" + obj.id).success(function(res) {
          $scope.methodData.splice(index, 1);
        }).error(function(res) {
          alert(res.message);
        })
      }

      $scope.goDetail = function(e, id) {
        e.stopPropagation()
        location.href = "/home/brand/" + brandId + "/goods/method#/detail?id=" + id
      }

    }
  ])
})
