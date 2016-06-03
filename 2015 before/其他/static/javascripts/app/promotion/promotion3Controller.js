define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
app.controller('promotion3Controller', ["$rootScope", '$scope', '$http', '$location', 'proSrv',
  function ($rootScope, $scope, $http, $location, proSrv) {
    $rootScope.CouponArr = [];
    $('.datepickerTime').datetimepicker();
    //自定义时间
    proSrv.selTime($scope, $http);
    //参加市别
    proSrv.servicehours($scope, $http);
    //添加不参加时间
    proSrv.nonparticipator($scope, $http);
    //添加门店
    proSrv.addShop($scope, $http);

    $scope.meanwhile = false;
    $scope.submitData = function () {
      var submitData = {
          "promotion": {
            "name": $scope.activity,
            //"营销活动的名字"
            "exclusive": true, //$scope.meanwhile,
            //"是否排他, true or false"
            "state": 1,
            // "状态",
            "dayspan": {
              "serviceHour": $scope.selServicehour,
              // "市别",
              "beginTime": $scope.promotionBeginTime,
              //"开始日期",
              "endTime": $scope.promotionEndTime,
              // "结束日期",
              "monday": "true",
              "tuesday": "true",
              "wednesday": "true",
              "thursday": "true",
              "friday": "true",
              "saturday": "true",
              "sunday": "true"
            },
            "shops": returnShopId($scope.alreadyShopData),
            //["shop 的 id"],
            "excludes": $scope.nonparticipatorTimeData //[{"serviceHour": "市别ID","beginTime": "开始日期","endTime": "结束日期",}]
              ,
            "remark": $scope.remark //"备注信息，可以没有"
          },
          "data": {
            "value": $scope.quota //"满额的金额，数字"
          },
          "details": returnDetails()
        }
        //console.log(submitData)
      $scope.isPosting = true
      $http.post("/home/brand/" + brandId + "/promotion/new/3", submitData).success(function () {
        alert('提交成功');
        $location.path("/promotion")
      }).error(function (error) {
        $scope.isPosting = false;
      })
    }

    function returnShopId(ShopObj) {
      var shopId = [];
      ShopObj.forEach(function (io) {
        shopId.push(io.shopId)
      });
      return shopId;
    }

    function returnVegetableId(VegetableArr) {
      var VegetableId = [];
      //console.log($rootScope.VegetableArr)
      VegetableArr.forEach(function (io) {
        VegetableId.push(io.subGroupId)
      });
      return VegetableId;

    }

    function returnDetails() {
      var details = [];
      //console.log($rootScope.CouponArr.length)
      $rootScope.CouponArr.forEach(function (io) {
        // console.log(io)
        details.push({
          "name": io.couponName,
          //"代金券的名称",
          "voucherQuantity": io.couponCount,
          //"赠送代金券的张数，这个数字要限制大小 [1,10]",
          "value": io.couponMoney,
          //"代金券面额,限制大小，[1, 1000]",
          "effectiveType": 2,
          // "1.指定有效时间, 消费时产生有效时间",
          "effectiveDays": io.couponTime,
          //"生效天数",
          "dayspan": {
            "serviceHour": io.couponServiceHours.id,
            // "市别 ID",
            "beginTime": io.couponBeginTime,
            //"开始日期",
            "endTime": io.couponEndTime,
            // "结束日期",
            "monday": io.preweekChecked.monday,
            "tuesday": io.preweekChecked.tuesday,
            "wednesday": io.preweekChecked.wednesday,
            "thursday": io.preweekChecked.thursday,
            "friday": io.preweekChecked.friday,
            "saturday": io.preweekChecked.saturday,
            "sunday": io.preweekChecked.sunday
          },
          "shops": returnShopId(io.ShopArr),
          "subgroups": returnVegetableId(io.VegetableArr),
          "remark": ""
        })

      });
      return details;

    }

  }
])
})
