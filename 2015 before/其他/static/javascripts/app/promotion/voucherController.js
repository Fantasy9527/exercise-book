define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
app.controller('voucherController', ["$rootScope", '$scope', '$http', '$location', '$timeout', 'proSrv',
  function ($rootScope, $scope, $http, $location, $timeout, proSrv) {
    $rootScope.CouponArr = [];
    $('.datepickerTime').datetimepicker();
    //自定义时间
    proSrv.selTime($scope, $http);
    //参加市别
    proSrv.servicehours($scope, $http);
    //添加不参加时间
    proSrv.nonparticipator($scope, $http);
    //选择时间
    proSrv.selTime($scope, $http);
    //添加门店
    proSrv.addShop($scope, $http);
    $scope.preweekChecked = "AllWeek";
    $scope.remark = "";
    $scope.meanwhile = false;
    $scope.effectiveType = 1;
    $scope.couponTime = 180;
    $scope.forSurcharge=false;
    $scope.toogleEffectiveType = function () {
      $scope.effectiveType == 1 ? $scope.effectiveType = 2 : $scope.effectiveType = 1;
      if ($scope.effectiveType == 2) {
        $scope.couponBeginTime == undefined && ($scope.couponBeginTime = moment().format("YYYY-MM-DD"));
        $scope.couponEndTime == undefined && ($scope.couponEndTime = moment().format("YYYY-MM-DD"));
      } else {
        $scope.couponTime == undefined && ($scope.couponTime = 1)
      }

    }
    $scope.submitData = function () {

        var submitData = {
          "name": $scope.couponName,
          "value": $scope.couponMoney,
          "realValue": $scope.realValue,
          "typetype": typeTypefilter(), // 1 = 无名代金券 2 = 有名代金券
          "effectiveType": $scope.effectiveType, // 生效类型 1 = 以营销计划开始时为准 2 = 以消费时间为准
          "effectiveDays": $scope.effectiveType == 1 ? 0 : $scope.couponTime, // 有效期天数, 如果是无名代金券，这2个值没有意义，对有名代金券有意义
          "dayspan": returnWeekType($scope.preweekChecked),
          "shops": returnShopId($scope.alreadyShopData), // 支持的门店
          "subgroups": returnVegetableId($scope.VegetableArr), // 支持的菜品小类
          "forSurcharge":$scope.forSurcharge,
          "remark": $scope.remark
        }

        if (submitData.shops.length == 0) {
          alert("请选择适用门店");
          return
        } else if (submitData.subgroups.length == 0) {
          alert("请添加菜品");
          return
        } else if (proSrv.checkWeek(submitData, true) /*第二个参数:是否为代金券*/ ) {
          alert("请选择每周参加时间")
        } else if (proSrv.timeContrast($scope.couponBeginTime, $scope.couponEndTime)) {
          alert('结束时间早于开始时间，请检查');
        } else {
          $scope.isPosting=true;
          $http.post("/home/brand/" + brandId + "/voucher/new", submitData).success(function () {
            alert('提交成功');
            $location.path("/voucherManage");
          }).error(function(error){
        $scope.isPosting=false;
      })
        }
      }
      //是否无名代金券
    function typeTypefilter() {
      if ($scope.isVoucherNum) {
        return 2; //有名代金券
      } else {
        return 1;
      }

    }
    //处理门店数组数据
    function returnShopId(ShopObj) {
      var shopId = [];
      if (typeof ShopObj == "undefined") {
        return []
      } else {
        ShopObj.forEach(function (io) {
          shopId.push(io.shopId)
        });
        return shopId;
      }
    }
    //处理菜品数组数据
    function returnVegetableId(VegetableArr) {
      var VegetableId = [];
      //console.log(VegetableArr);
      if (typeof VegetableArr == "undefined") {
        return []
      } else {
        VegetableArr.forEach(function (io) {
          VegetableId.push(io.subGroupId)
        });
        return VegetableId;
      }

    }

    //添加大类
    $scope.addVegetableShow = false;
    proSrv.addVegeSubgroups($rootScope, $scope, $http);
    $rootScope.CouponArr = [];

    $scope.$watch("couponTime",
      function () {
        if ($scope.couponTime > 180) {
          $scope.couponTimeError = true;
          $timeout.cancel(couponTimer);
          var couponTimer = $timeout(function () {
              $scope.couponTime = 180;
              $scope.couponTimeError = false;
            },
            1500)
        } else {
          $scope.couponTimeError = false;
          $timeout.cancel(couponTimer)
        }
      })

    function returnServiceHours(id) {
      for (var i = 0; i < $scope.servicehours.length; i++) {
        if ($scope.servicehours[i].id == id) {
          return $scope.servicehours[i]
        }
      }
    }

    $scope.preCustomMonday = true;
    $scope.preCustomTuesday = true;
    $scope.preCustomWednesday = true;
    $scope.preCustomThursday = true;
    $scope.preCustomFriday = true;
    $scope.preCustomSaturday = true;
    $scope.preCustomSunday = true;

    function returnWeekType(type) {
      var weekType = [{
        type: "AllWeek",
        "beginTime": $scope.couponBeginTime,
        "endTime": $scope.couponEndTime,
        serviceHour: returnServicehour($scope.defaultServiceHours),
        "monday": "true",
        "tuesday": "true",
        "wednesday": "true",
        "thursday": "true",
        "friday": "true",
        "saturday": "true",
        "sunday": "true"
          }, {
        type: "manDay",
        //name: "周一至周五",
        "beginTime": $scope.couponBeginTime,
        "endTime": $scope.couponEndTime,
        serviceHour: returnServicehour($scope.defaultServiceHours),
        "monday": "true",
        "tuesday": "true",
        "wednesday": "true",
        "thursday": "true",
        "friday": "true",
        "saturday": "false",
        "sunday": "false"

          }, {
        type: "weekend",
        //name: "周日至周六",
        "beginTime": $scope.couponBeginTime,
        "endTime": $scope.couponEndTime,
        serviceHour: returnServicehour($scope.defaultServiceHours),
        "monday": "false",
        "tuesday": "false",
        "wednesday": "false",
        "thursday": "false",
        "friday": "false",
        "saturday": "true",
        "sunday": "true"
          }, {
        type: "custom",
        name: "自定义"

          }];

      for (var i = 0; i < weekType.length; i++) {
        if (weekType[i].type == type) {
          if (weekType[i].type == "custom") {
            var customWeek = {
              name: "自定义",
              serviceHour: returnServicehour($scope.defaultServiceHours),
              "beginTime": $scope.couponBeginTime,
              "endTime": $scope.couponEndTime,
              monday: $scope.preCustomMonday,
              tuesday: $scope.preCustomTuesday,
              wednesday: $scope.preCustomWednesday,
              thursday: $scope.preCustomThursday,
              friday: $scope.preCustomFriday,
              saturday: $scope.preCustomSaturday,
              sunday: $scope.preCustomSunday
            }
            return customWeek
          } else {
            return weekType[i];
          }
        }

      }
    }

    //处理市别
    function returnServicehour(id) {
      if (id == 0) {
        return null
      }
      return id
    }

  }
])
})
