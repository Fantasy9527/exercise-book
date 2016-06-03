define(["systemApp","popupoverlay"], function(app) {
  //自定义菜单
  app.controller("menusetController", ["$scope", "$http", "$rootScope", "$state", "$timeout", function($scope, $http, $rootScope, $state, $timeout) {
    var auId = $state.params.auId;
    $scope.showMenu = function() {
      $('#myModal').modal({
        keyboard: true
      })
    }
    $scope.isHaveData = false;
    getData();

    function getData() {
      $http.get("/weixin/platform/show/menu/auth/" + auId).success(function(res) {
        $scope.model = res.menus;
        if (res.menus.length == 0) {
          $scope.isHaveData = false;
        } else {
          $scope.isHaveData = true;
        }
        $scope.identical = res.state;
      })
    }

    $scope.tabChange = function(index) {
      $scope.tabIndex = index;
    }


    //创建
    $scope.create = function() {
      $scope.isHaveData = true;
      $scope.model[$(".tab-pane.active").index()] = {
        fatherMenu: {
          name: "",
          content: "",
          event: 2,
          isEdit: true
        },
        childMenu: []
      }
    }

    //保存创建
    $scope.save = function(obj) {
        //后台需要每一个加上2
        $scope.model.forEach(function(io) {
          io.fatherMenu.event = 2;
          io.childMenu.forEach(function(io) {
            io.event = 2
          })
        });
        var data = {
          menus: $scope.model
        }
        $http.post("/weixin/platform/save/menu/auth/" + auId, data).success(function() {
          obj.isEdit = false;
          $scope.identical = false;
        })

      }
      //$scope.save()
    $scope.addMenu = function() {
      var haveEdit = false;
      if (!$scope.model[$(".tab-pane.active").index()]) {
        $scope.model[$(".tab-pane.active").index()] = {
          fatherMenu: {
            isEdit: true,
            content: "",
            name: ""
          },
          childMenu: []
        }
      } else {
        for (var i = 0; i < $scope.model[$(".tab-pane.active").index()].childMenu.length; i++) {
          if ($scope.model[$(".tab-pane.active").index()].childMenu[i].isEdit) {
            return
          }
        }
        if ($scope.model[$(".tab-pane.active").index()].fatherMenu.isEdit) {
          return
        }
        $scope.model[$(".tab-pane.active").index()].childMenu.push({
          name: "",
          content: "",
          event: 2,
          isEdit: true
        })
      }

    }



    $scope.edit = function(obj) {
      if (obj.isEdit) {
        return
      }
      $scope.model[$(".tab-pane.active").index()].childMenu.forEach(function(io) {
        if (io.isEdit) {
          io.name = $scope.temp.name;
          io.content = $scope.temp.content;
        }
        io.isEdit = false;
      });
      if ($scope.model[$(".tab-pane.active").index()].fatherMenu.isEdit) {
        $scope.model[$(".tab-pane.active").index()].fatherMenu.name = $scope.temp.name;
        $scope.model[$(".tab-pane.active").index()].fatherMenu.content = $scope.temp.content;
        $scope.model[$(".tab-pane.active").index()].fatherMenu.isEdit = false;
      }
      $scope.temp = angular.copy(obj);
      obj.isEdit = true;
    }

    //取消
    $scope.cancle = function(obj, e, s) {
        e.stopPropagation();
        if ($scope.hasOwnProperty("temp")) {
          obj.name = $scope.temp.name,
            obj.content = $scope.temp.content,
            obj.isEdit = false
        } else {
          if (s == "f") {
            $scope.isHaveData = false;
          } else {
            $scope.model[$(".tab-pane.active").index()].childMenu.pop()
          }

        }

      }
      //删除主菜单
    $scope.delFatherData = function(e) {
      e.stopPropagation();
      if ($scope.model.length == 1) {
        var isOk = confirm("您确定要删除所有菜单,此操作不需发布便可立即生效")
        if (!isOk) {
          return
        };
        $http.delete("/weixin/platform/remove/menu/auth/" + auId + "/brand/" + brandId).success(function() {
          $scope.isHaveData = false;
          $scope.identical = true;
        })
      } else {
        $scope.model.splice($(".tab-pane.active").index(), 1);
        $scope.model.forEach(function(io) {
          io.fatherMenu.event = 2;
          io.childMenu.forEach(function(io) {
            io.event = 2
          })
        });
        var data = {
          menus: $scope.model
        }
        $http.post("/weixin/platform/save/menu/auth/" + auId, data).success(function() {
          $scope.identical = false;
        })

      }


    }

    //删除子菜单
    $scope.delData = function(e, index) {
      e.stopPropagation();
      var isOk = confirm("您确定要删除该菜单")
      if (!isOk) {
        return
      };
      var temp = angular.copy($scope.model);
      temp[$(".tab-pane.active").index()].childMenu.splice(index, 1);
      console.log(temp);
      //后台需要每一个加上2
      temp.forEach(function(io) {
        io.fatherMenu.event = 2;
        io.childMenu.forEach(function(io) {
          io.event = 2
        })
      });
      var data = {
        menus: temp
      }
      $http.post("/weixin/platform/save/menu/auth/" + auId, data).success(function() {
        $scope.model = temp;
        $scope.identical = false;
      })


    }

    $('#lightCustomModal').popup({
      //pagecontainer: '.container',
      transition: 'all 0.3s'
    });
    $(document).off("click", ".release")
    $(document).on("click", ".release", function() {
      $scope.release();
    })

    $scope.release = function() {
      $http.get("/weixin/platform/release/menu/auth/" + auId + "/brand/" + brandId).success(function(res) {
        $scope.identical = true;
        if (res.errmsg == "ok") {
          alert("发布成功");
        } else {
          alert("发布失败")
        }
      }).error(function() {
        alert("发布失败");
      });
    }


  }])
})
