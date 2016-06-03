define(["angular", "uiRouter", "ngTagsInput", "gritter"], function() {
  var app = angular.module('sanyiapp', ['ui.router', 'ngTagsInput']); 
  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/weixin').when("", "/weixin");
    $stateProvider
      .state('weixin', { //促销列表
        url: '/weixin',
        views: {
          '': {
            templateUrl: '/assets/templates/weixin/index.html'
          },
          "main@weixin": {
            templateUrl: "/assets/templates/weixin/authorization.html",
            controller: "authorizationController"
          }
        }
      })
      .state("weixinSet", {
        url: "/weixinSet",
        views: {
          '': {
            templateUrl: '/assets/templates/weixin/index.html'
          },
          "nav@weixinSet": {
            templateUrl: '/assets/templates/weixin/nav.html',
            controller: "navController"
          }
        }
      })
      //会员设置
      .state("weixinSet.memberset", {
        url: "/memberset?auId",
        views: {
          "main@weixinSet": {
            templateUrl: "/assets/templates/weixin/memberSet.html",
            controller: "membersetController"
          }
        }
      })
      //菜单设置
      .state("weixinSet.menuset", {
        url: "/menuset?auId",
        views: {
          "main@weixinSet": {
            templateUrl: "/assets/templates/weixin/menuSet.html",
            controller: "menusetController"
          }
        }
      })
      //关键字回复
      .state("weixinSet.keywordReply", {
        url: "/keywordreply?auId",
        views: {
          "main@weixinSet": {
            templateUrl: "/assets/templates/weixin/keywordReply.html",
            controller: "keywordreplyController"
          }
        }
      })
      //欢迎用语
      .state("weixinSet.welcome", {
        url: "/welcome?auId",
        views: {
          "main@weixinSet": {
            templateUrl: "/assets/templates/weixin/welcome.html",
            controller: "welcomeController"
          }
        }
      })
      //关键字添加
      .state("replyDetail", {
        url: "/replyDetail?auId",
        views: {
          "": {
            templateUrl: "/assets/templates/weixin/replyDetail.html",
            controller: "replyDetailConyroller"
          }
        }
      })
      //关键字修改
      .state("replySet", {
        url: "/replySet/regulation/:regId/auth/:auId/t/:tId",
        views: {
          "": {
            templateUrl: "/assets/templates/weixin/replyDetail.html",
            controller: "replySetConyroller"
          }
        }
      })
  });
  app.run(function($http, $rootScope, $state, $location) {
    $rootScope.brandId = brandId;
    $rootScope.auId = $location.search().auId;
    if (!$rootScope.auId) {
      $location.path("/weixin");
    }
  })
  app.controller("navController", ["$scope", "$state", function($scope, $state) {
      console.log($state.params.auId)
      $scope.navList = [{
        name: "菜单设置",
        sref: "weixinSet.menuset({auId:" + $state.params.auId + "})",
        sel: false
      }, {
        name: "关键字自动回复",
        sref: "weixinSet.keywordReply({auId:" + $state.params.auId + "})",
        sel: false
      }, {
        name: "微信会员设置",
        sref: "weixinSet.memberset({auId:" + $state.params.auId + "})",
        sel: false
      }, {
        name: "欢迎用语设置",
        sref: "weixinSet.welcome({auId:" + $state.params.auId + "})",
        sel: false
      }];
      $scope.changeNav = function(o) {
        $scope.navList.forEach(function(io) {
          io.sel = false;
        })
        o.sel = true;
      }
    }])
    //授权列表
  app.controller("authorizationController", ["$scope", "$rootScope", "$http", function($scope, $rootScope, $http) {

    $scope.auth = function() {
      $http.get("/weixin/platform/auth/brand/" + brandId + "/member/" + $scope.memberType + "/touch").success(function(res) {
        location.href = res;
      })
    }

    $http.get("/weixin/platform/auth/brand/" + brandId + "/index").success(function(res) {
      console.log(res);
      if (res.memberTypes.length == 0) {
        alert("您还未设置会员类型，请尽快设置");
        location.href = "/home/brand/" + brandId + "/member/type";
        return
      }
      $scope.authList = res.authList;
      $scope.memberTypes = res.memberTypes;
      $scope.memberType = $scope.memberTypes[0].id;
    })
    $scope.isCreate = false;
    $scope.createAuth = function() {
        $scope.isCreate = true;
      }
      //取消
    $scope.cancelCraete = function() {
      $scope.isCreate = false;
    }
  }])




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





  //会员设置
  app.controller("membersetController", ["$scope", "$http", "$state", function($scope, $http, $state) {
    var auId = $state.params.auId;
    $http.get("/weixin/platform/brand/" + brandId + "/auth/" + auId + "/member/type/show").success(function(res) {
      console.log(res);
      $scope.model = res.authors;

      res.memberTypes.forEach(function(io) {
        io.state = 0;
        res.authors.forEach(function(author) {
          if (author.id == io.id) {
            io.sel = true;
            io.state = author.state;
          }
        })
      })
      $scope.memberTypes = res.memberTypes;

    })
    $scope.addMemberShow = false;
    //打开添加
    $scope.addMemberTable = function() {
        $scope.addMemberShow = !$scope.addMemberShow;
      }
      //关闭添加
    $scope.closeTable = function() {
        $scope.addMemberShow = false;
      }
      //全选
    $scope.selMemberAll = function() {
        $scope.memberTypes.forEach(function(member) {
          if (member.state != 1) {
            member.sel = $scope.chkAllBtn;
          }

        })
      }
      //选择会员
    $scope.selmember = function(obj) {
        if (obj.state == 1) {
          alert("默认会员不允许取消")
        } else {
          obj.sel = !obj.sel;
        }

      }
      //添加会员
    $scope.addMember = function() {
        var arr = [];
        $scope.memberTypes.forEach(function(member) {
          if (member.sel) {
            arr.push(member)
          }
        })
        saveData(arr, function() {
          $scope.model = arr;
          $scope.addMemberShow = false;
        })
      }
      //删除数据
    $scope.delData = function(obj, index) {
        var data = angular.copy($scope.model);
        var delObj = data[index];
        data.splice(index, 1);
        saveData(data, function() {
          $scope.model = data;
          $scope.memberTypes.forEach(function(io) {
            if (io.id == delObj.id) {
              io.sel = false;
            }
          })
        })
      }
      //设置默认
    $scope.setDefault = function(x) {
      var data = angular.copy($scope.model);
      data.forEach(function(io) {
        io.state = 0;
        if (io.id == x.id) {
          io.state = 1;
        }
      })
      saveData(data, function() {
        $scope.model = data;
        $scope.memberTypes.forEach(function(memberType) {
          $scope.model.forEach(function(model) {
            if (memberType.id == model.id) {
              memberType.state = model.state;
            }
          })
        })
      })
    }

    function saveData(data, callBack) {
      var json = {};
      json.authId = auId;
      json.memberTypes = data.map(function(io) {
        return {
          state: io.state,
          tId: io.id
        }
      })
      $http.post("/weixin/platform/auth/brand/" + brandId + "/member/type/save", json).success(function() {
        if (callBack) {
          callBack();
        }
      })
    }





  }])



  //获取规则
  app.controller("keywordreplyController", ["$scope", "$rootScope", "$http", "$location", "$state", function($scope, $rootScope, $http, $location, $state) {
    var auId = $state.params.auId;
    $scope.auId = auId;
    $http.get("/weixin/platform/words/regulation/auth/" + auId).success(function(res) {
      $scope.models = res.message;
    })

    $scope.delReg = function(model, index) {
      $http.delete("/weixin/platform/words/remove/regulation/" + model.regId + "/auth/" + model.authId)
        .success(function() {
          $scope.models.splice(index, 1);
        })
    }

    $scope.skipSet = function(model) {
      $location.path("/replySet/regulation/" + model.regId + "/auth/" + auId + "/t/" + model.tId).search({});
    }


  }])

  //保存规则
  app.controller("replyDetailConyroller", ["$scope", "$http", "$rootScope", "$state", "$location", function($scope, $http, $rootScope, $state) {
    var auId = $state.params.auId;
    $scope.auId = auId;
    $scope.tags = [];
    $scope.loadTags = function(query) {
      /*
          return $http.get('/tags?query=' + query);*/
    };

    $scope.saveData = function() {
      var data = {
        "regName": $scope.regName,
        "words": $scope.tags.map(function(io) {
          return io.text
        }),
        "text": $scope.regText
      }
      console.log(data);
      $http.post("/weixin/platform/words/regulation/save/auth/" + auId, data).success(function(res) {
        $state.go("weixinSet.keywordReply", {
          auId: auId
        });
      })
    }


  }])

  //修改规则
  app.controller("replySetConyroller", ["$scope", "$http", "$stateParams", "$rootScope", "$state", function($scope, $http, $stateParams, $rootScope, $state) {
    console.log($stateParams)
    $scope.auId = $stateParams.auId;
    $http.get("/weixin/platform/words/regulation/" + $stateParams.regId + "/auth/" + $stateParams.auId).success(function(res) {
      $scope.regName = res.regName;
      $scope.regText = res.content;
      $scope.tags = res.words.map(function(io) {
        return io.name
      });
    });

    $scope.saveData = function() {
      var data = {
        "tId": $stateParams.tId,
        "regId": $stateParams.regId,
        "regName": $scope.regName,
        "words": $scope.tags.map(function(io) {
          return io.text
        }),
        "text": $scope.regText
      }
      console.log(data);
      $http.post("/weixin/platform/words/regulation/renewal/auth/" + $stateParams.auId, data).success(function(res) {
        $state.go("weixinSet.keywordReply", {
          auId: $stateParams.auId
        });
      })
    }


  }])


  //欢迎
  app.controller("welcomeController", ["$scope", "$http", "$stateParams", "$rootScope", "$state", "$timeout", function($scope, $http, $stateParams, $rootScope, $state, $timeout) {
    console.log($stateParams)
    $scope.auId = $stateParams.auId;
    $http.get("/weixin/platform/show/auto/massage/reply/auth/" + $scope.auId).success(function(res) {
      $scope.welcome = res;
      $scope.content = res.content;
      $scope.$watch("content", function(i, y) {
        if ($scope.content.length > 200) {
          $scope.content = $scope.content.slice(0, 200)
        }
      })
    }).error(function(err) {
      $scope.welcome = err;
    })
    $scope.changeDone = false;
    $scope.delDone = false;

    $scope.saveData = function() {
      var data = {
        regId: $scope.welcome.regId,
        tId: $scope.welcome.tId,
        regName: $scope.welcome.regName || "",
        form: 0,
        content: $scope.content
      }
      $http.post("/weixin/platform/renew/auto/massage/reply/auth/" + $scope.auId, data).success(function(res) {
        $scope.changeDone = true;
        $scope.welcome.regId = res.regId;
        $scope.welcome.tId = res.tId;
        $timeout(function() {
          $scope.changeDone = false;
        }, 3000)
      })
    }

    $scope.delData = function() {
      $http.get("/weixin/platform/remove/auto/massage/reply/" + $scope.welcome.regId + "/auth/" + $scope.auId).success(function(res) {
        $scope.welcome.content = "";
        $scope.delDone = true;
        $timeout(function() {
          $scope.delDone = false;
        }, 3000)
      })
    }

  }])



})
