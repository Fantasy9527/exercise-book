define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
app.controller("promotionDetailsController", ["$rootScope", '$scope', '$http', '$location', '$timeout', 'proSrv',
  function ($rootScope, $scope, $http, $location, $timeout, proSrv) {
    var detailType = "promotion";
    var isVoucher = $location.search().voucher;
    if (isVoucher) {
      detailType = "voucher"
    } else {
      detailType = "promotion"
    }
    $http.get("/home/brand/" + brandId + "/" + detailType + "/" + $location.search().id).success(function (res) {
      if (isVoucher) {
        $scope.model = res.voucherType;
        $scope.subgroups = res.subgroups;
      } else {
        $scope.model = res.promotion;
      }


      function returnShop(obj) {
        var shopStr = "";
        obj.forEach(function (io) {
          shopStr += (io.name + "  ")
        });
        return shopStr;
      }

      $scope.weekDay = function (oWeek) {
        var weekStr = '';
        if (oWeek) {
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
        }

        return weekStr;
      }
      var pormotionTypes = [{
        id: 1,
        name: "特价"
          }, {
        id: 7,
        name: "代金券"
          }, {
        id: 9,
        name: "会员充值营销"
          }, {
        id: 10,
        name: "会员价格"
          }, {
        id: 11,
        name: "打折促销"
          }]


      var tabData;

      if (isVoucher) {
        $scope.promotionType = 7
      } else {
        $scope.promotionType = res.promotion._promotionType.id;
      };
      switch ($scope.promotionType) {
      case 1: //特价
        tabData = [{
          name: "基本信息",
          id: 1
      }, {
          name: "特价商品",
          id: 2
          }, {
          name: "不参加活动时间段",
          id: 6
          }];
        break;

      case 7: //代金券
        tabData = [{
          name: "基本信息",
          id: 1
      }, {
          name: "适用菜品范围",
          id: 4
          }];
        break;

      case 9: //会员充值营销
        tabData = [{
          name: "基本信息",
          id: 1
      }, {
          name: "充值规则",
          id: 5
          }, {
          name: "不参加活动时间段",
          id: 6
          }];
        break;

      case 10: //会员价格
        tabData = [{
          name: "基本信息",
          id: 1
      }, {
          name: "会员价",
          id: 7
          }, {
          name: "不参加活动时间段",
          id: 6
          }];
        break;

      case 11: //打折促销
        tabData = [{
          name: "基本信息",
          id: 1
      }, {
          name: "打折详情",
          id: 8
          }, {
          name: "不参加活动时间段",
          id: 6
          }];
        break;

      case 12: //完善资料送代金券
        tabData = [{
          name: "基本信息",
          id: 1
      }, {
          name: "代金券",
          id: 10
          }];
        break;



      }


      $scope.showPanel = 1;
      tabData.forEach(function (io) {
        io.active = false
      })
      tabData[0].active = true;
      $scope.tabData = tabData;
      $scope.tabChange = function (o) {
        tabData.forEach(function (io) {
          io.active = false
        })
        o.active = true;
        $scope.showPanel = o.id

      }
      if (isVoucher) {
        $scope.promotionWeek = $scope.weekDay(res.voucherType);
        $scope.promotionShop = returnShop(res.shops);
        $scope.promotionTime = $scope.weekDay(res.voucherType);
        //console.log(res.promotion);
        $scope.promotionServiceHour = isServiceHourNull(res.voucherType._serviceHour);
        $scope.promotionServiceHourId = isServiceHourId(res.voucherType._serviceHour);
      } else {
        $scope.promotionWeek = $scope.weekDay(res.promotion);
        $scope.promotionShop = returnShop(res.promotion.shops);
        $scope.promotionTime = $scope.weekDay(res.details._voucherType);
        //console.log(res.promotion);
        $scope.details = res.details;
        $scope.promotionServiceHour = isServiceHourNull(res.promotion._serviceHour);
        $scope.promotionServiceHourId = isServiceHourId(res.promotion._serviceHour);
        console.log($scope.model.excludes)
        for (var i = 0; i < $scope.model.excludes.length; i++) {
          if ($scope.model.excludes[i]._serviceHour == null) {
            $scope.model.excludes[i]._serviceHour = {
              name: "全天",
              id: 0
            }
          }
        }


      }



      function isServiceHourNull(obj) {
        if (obj == null) {
          return "全天"
        }
        return obj.name

      }

      function isServiceHourId(obj) {
        if (obj == null) {
          return 0
        }
        return obj.id
      }

    })

  }
])
})
