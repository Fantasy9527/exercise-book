require.config({
  paths: {
    "moment": "js/moment.min"
  }
})
var app = angular.module("weixin", ["ui.router", "ngTouch"])
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', { //会员卡
      url: '/home?authId',
      templateUrl: 'templates/home.html',
      controller: 'homeController',
      data: {
        title: ""
      }
    }).state('swingCard', { //会员卡
      url: '/swingCard?authId&sn',
      templateUrl: 'templates/swingCard.html',
      controller: 'swingCardController',
      data: {
        title: "刷卡"
      }
    })
    .state('fillMaterial', { //完善个人资料
      url: '/fillMaterial?authId',
      templateUrl: 'templates/personal.html',
      controller: 'fillMaterialController',
      data: {
        title: "个人信息"
      }
    })
    .state('account', { //消费记录
      url: '/account?authId',
      templateUrl: 'templates/account.html',
      controller: 'accountController',
      data: {
        title: "消费记录"
      }
    })
    .state('coupon', { //优惠券
      url: '/coupon?authId',
      templateUrl: 'templates/coupon.html',
      controller: 'couponController',
      data: {
        title: "优惠券"
      }
    })
    .state('balance', { //我的积分
      url: '/balance?authId',
      templateUrl: 'templates/balance.html',
      controller: 'balanceController',
      data: {
        title: "充值"
      }
    })
    .state('information', { //个人资料
      url: '/information?authId',
      templateUrl: 'templates/information.html',
      controller: 'informationController',
      data: {
        title: "个人资料"
      }
    })
    .state('promotion', { //优惠
      url: '/promotion?authId',
      templateUrl: 'templates/promotion.html',
      controller: 'promotionController',
      data: {
        title: "优惠"
      }
    })
    .state('promotionDetail', { //优惠详情
      url: '/promotionDetail?authId&brand&promotion',
      templateUrl: 'templates/promotionDetail.html',
      controller: 'promotionDetailController',
      data: {
        title: "优惠详情"
      }
    })
    .state('success', { //成功
      url: '/success?authId',
      templateUrl: 'templates/success.html',
      controller: 'successController',
      data: {
        title: "成功"
      }
    })
    .state('shops', { //门店
      url: '/shops?authId',
      templateUrl: 'templates/shops.html',
      controller: 'shopsController',
      data: {
        title: "门店"
      }
    })
    .state('vip', { //会员
      url: '/vip?authId',
      templateUrl: 'templates/vip.html',
      controller: 'vipController',
      data: {
        title: "会员详情"
      }
    })
    .state('bind', { //绑定实体卡
      url: '/bind?authId',
      templateUrl: 'templates/bind.html',
      controller: 'bindController',
      data: {
        title: "绑定实体卡"
      }
    })
})
var globalFn = {};
globalFn.title = function(title) {
  document.title = title;
  // hack在微信等webview中无法修改document.title的情况
  var iframe = document.createElement("iframe");
  iframe.src = "/favicon.ico";
  document.body.appendChild(iframe);
  iframe.onload = function() {
    setTimeout(function() {
      document.body.removeChild(iframe);
    }, 0)
  }
}
app.run(["$rootScope", "$location", "$http", function($rootScope, $location, $http) {
  var params = $location.search();
  if (location.origin != "http://test.sanyipos.com") {
    $rootScope.debug = true;
  }
  $rootScope.isLoding = true;
  $rootScope.authId = params.authId || -1;
  setTimeout(function() {
    angular.element(document.querySelectorAll(".spinner")).css("margin", (window.screen.height - 60) / 2 + "px auto");
  }, 200)

}])

app.controller("homeController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {

  $http.get("/weixin/platform/auth/" + $rootScope.authId + "/account/info").success(function(res) {
    globalFn.title(res.name);
  })

  $http.get("/weixin/platform/auth/" + $scope.authId + "/member/card/info").success(function(res) {
    $scope.model = res;
    $rootScope.voucher = res.voucher;
    $scope.isLoding = false;
  }).error(function(error) {
    alert(error.message);
  })

  $scope.goBalance = function() {
    location.href = "/weixin/member/charge?authId=" + $scope.authId + "&brand=" + $scope.model.brands.id + "&openid=" + $scope.model.openid
  }

}])

app.controller("swingCardController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  console.log($state.params)
  globalFn.title($state.current.data.title);
  $scope.sn = $state.params.sn;
  $scope.sn_1 = $state.params.sn.substr(0, 4);
  $scope.sn_2 = $state.params.sn.substr(4, 4);
  $scope.sn_3 = $state.params.sn.substr(8, 4);
  $scope.imgUrl = "http://qr.liantu.com/api.php?text=" + $state.params.sn;
  $scope.isLoding = false;
}])

app.controller("fillMaterialController", ["$scope", "$rootScope", "$state", "$location", "$http", "$interval", "$timeout", function($scope, $rootScope, $state, $location, $http, $interval, $timeout) {
  globalFn.title($state.current.data.title);
  require(["moment"], function(moment) {
    if (!$scope.voucher) {
      $http.get("/weixin/platform/auth/" + $scope.authId + "/member/card/info").success(function(res) {
        $rootScope.voucher = res.voucher;
      }).error(function(error) {
        alert(error.message);
      })
    }
    $http.get("/weixin/platform/auth/" + $scope.authId + "/get/member/profile/info").success(function(res) {
      //没有填充
      if (!res.isFill) {
        $scope.sex = 1;
        $scope.name = res.name;
      } else {
        //填充完成
        $scope.name = res.name;
        $scope.sex = res.sex == "男" ? 1 : 2;
        $scope.birthday = moment(res.birthday)._d;
        $scope._birthday = !!res.birthday ? res.birthday : "未填写";
        $scope.mobile = res.mobile;
        $scope.openid = res.openid;
        $scope.isRegister = true;
      }
      $scope.isLoding = false;
    }).error(function(error) {
      alert(error.message);
    })
    $scope.sexSelect = [{
      name: "男",
      id: 1
    }, {
      name: "女",
      id: 2
    }]

    $scope.getCodeTime = "获取验证码"
    $scope.getCode = function() {
      if ($scope.getCodeTime != "获取验证码") {
        return
      }
      var json = {
        "name": $scope.name,
        "sex": $scope.sex == 1 ? "男" : "女",
        birthday: $scope.birthday == undefined ? null : moment($scope.birthday).format("YYYY-MM-DD"),
        mobile: $scope.mobile,
        authId: $scope.authId
      }
      $http.post("/weixin/platform/auth/" + $scope.authId + "/fill/member/profile", json).success(function() {
        alert("获取验证码成功");
        $scope.getCodeTime = 60;
        var time = $interval(function() {
          if ($scope.getCodeTime == 1) {
            $interval.cancel(time);
            $scope.getCodeTime = "获取验证码";
          } else {
            $scope.getCodeTime--
          }
        }, 1000)
      })
    }

    $scope.saveData = function(invalid) {
      if (invalid) {
        return
      }
      var json = {
          //openid: $scope.openid,
          code: $scope.code
        }
        //console.log(json)
      $http.post("/weixin/platform/auth/" + $scope.authId + "/verify/profile", json).success(function() {
        $state.go("success");
      }).error(function(error) {
        alert(error.message)
      })
    }
  })

}])


//消费记录
app.controller("accountController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);
  $http.get("/weixin/platform/auth/" + $scope.authId + "/member/bill/info").success(function(res) {
    $scope.isLoding = false;
    console.log(res);
    $scope.consume = res.consume;
  })

}])




//优惠券
app.controller("couponController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);
  $http.get("/weixin/platform/auth/" + $scope.authId + "/voucher/info").success(function(res) {
    $scope.isLoding = false;
    $scope.model = res.voucherData;
  }).error(function(error) {
    //console.log(error);
    alert(error.message);
  })

  $scope.open = function(obj) {
    if (obj.hasOwnProperty("open")) {
      obj.open = !obj.open
    } else {
      obj.open = true
    }

    if (!obj.qrc) {
      obj.qrc = "/tool/barcode?code=" + obj.sn;
    }

  }


}])

app.controller("integralController", ["$scope", "$rootScope", "$state", function($scope, $rootScope, $state) {
  globalFn.title($state.current.data.title);
  var params = $state.params;
  params = {
    "name": "",
    "sex": "",
    birthday: "",
    mobile: "",
    authId: "",
    openId: ""
  };

}])

app.controller("informationController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);
  $http.get("/weixin/platform/auth/" + $scope.authId + "/member/profile/info").success(function(res) {
    $scope.isLoding = false;
    //console.log(res);
    $scope.name = res.name;
    $scope.sex = res.sex;
    $scope.mobile = res.mobile;
    $scope.birthday = res.birthday;
  }).error(function(error) {
    alert(error.message);
  })
}])

app.controller("promotionController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);
  $http.get("/weixin/platform/auth/" + $scope.authId + "/member/promotion/info").success(function(res) {
    $scope.isLoding = false;
    $scope.model = res.promotion;
  })
}])

app.controller("promotionDetailController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);
  $scope.isLoding = false;
  var params = $state.params;
  $http.get("/weixin/platform/auth/" + $scope.authId + "/brand/" + params.brand + "/shop/promotion/" + params.promotion).success(function(res) {
    $scope.model = res;

  })
}])

app.controller("successController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);

}])

app.controller("shopsController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);
  var params = $state.params;
  $http.get("/weixin/platform/auth/" + $scope.authId + "/member/shop/info").success(function(res) {
    $scope.isLoding = false;
    console.log(res.shops[0]);
    $scope.model = res.shops;
  })

}])
app.controller("vipController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http) {
  globalFn.title($state.current.data.title);
  $http.get("/weixin/platform/auth/" + $scope.authId + "/member/card/info").success(function(res) {
    $scope.memberTypes = res.memberTypes;
    $scope.isLoding = false;
  })

}])

app.controller("bindController", ["$scope", "$rootScope", "$state", "$http", "$interval", function($scope, $rootScope, $state, $http, $interval) {
  globalFn.title($state.current.data.title);
  $scope.getCodeTime = "获取验证码";
  $scope.isLoding = false;
  $scope.getVerify = function() {
    if ($scope.getCodeTime != "获取验证码") {
      return
    }
    $http.post("/weixin/platform/auth/" + $scope.authId + "/bind/member", {
      mobile: $scope.mobile
    }).success(function() {
      alert("验证码获取成功");
      $scope.getCodeTime = 60;
      var time = $interval(function() {
        if ($scope.getCodeTime == 1) {
          $interval.cancel(time);
          $scope.getCodeTime = "获取验证码";
        } else {
          $scope.getCodeTime--
        }
      }, 1000)
    }).error(function(err) {
      alert(err.message)
    })
  }

  $scope.bindCard = function() {
    if ($scope.code == "") {
      return
    }
    $http.post("/weixin/platform/auth/" + $scope.authId + "/verify/bind/member", {
      code: $scope.code
    }).success(function(res) {
      $state.go("success");
    }).error(function(err) {
      alert(err.message)
    })
  }
}])

app.controller("balanceController", ["$scope", "$rootScope", "$state", "$http", "$location", function($scope, $rootScope, $state, $http, $location) {
  globalFn.title($state.current.data.title);
  $http.get("/weixin/platform/auth/" + $scope.authId + "/member/card/info").success(function(res) {
    $scope.model = res;
    getPromotion()
  })

  function getPromotion() {
    $http.get("/weixin/platform/auth/" + $scope.authId + "/brand/recharge/promotion").success(function(res) {
      $scope.isLoding = false;
      $scope.isWxPay = res.isWxPay;
      $scope.balancePromotions = [];
      res.promotions.forEach(function(io) {
        io.recharge.forEach(function(recharge) {
          recharge.brand = io.brand;
          recharge.promotion = io.id;
          $scope.balancePromotions.push(recharge)
        })
      })
      $scope.balancePromotions[0].active = true;
      $scope.selRecharge = function(obj) {
        $scope.balancePromotions.forEach(function(io) {
          io.active = false;
        })
        obj.active = true;
      }
    })
  }



  $scope.recharge = function() {
    var data;
    $scope.balancePromotions.forEach(function(io) {
      if (io.active) {
        data = {
          brand: io.brand,
          member: $location.search().member,
          promotion: io.promotion,
          charge: io.id
        }
      }
    })
    $http.post("/weixin/member/charge", data).success(function(charge) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', charge.wxpay,
        function(res) {
          //alert(JSON.stringify(res));
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            $http.get("/weixin/member/charge/ack/" + charge.bill).success(function() {
              $state.go("success");
            })
          }
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg
          //将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        }
      );

      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    })
  }

}])
