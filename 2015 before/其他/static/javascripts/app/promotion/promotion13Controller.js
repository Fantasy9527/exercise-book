define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller('promotion13Controller', ["$rootScope", '$scope', '$http', '$location', "$state", 'proSrv',
    function($rootScope, $scope, $http, $location, $state, proSrv) {
      $('.datepickerTime').datetimepicker();
      //添加门店
      proSrv.addShop($scope, $http);
      $scope.vouchers = [];
      //代金券

      $http.get("/home/brand/" + brandId + "/promotion/weixin").success(function(res) {
        res.voucherTypes.forEach(function(io) {
          io.sel = false;
        })
        $scope.voucherData = res.voucherTypes;
        $scope.WeixinData = res.weixins;
        $scope.weixin = $scope.WeixinData[0].appid;
      })
      $scope.addVoucherShow = false;
      $scope.addVoucherTable = function() {
        $scope.addVoucherShow = !$scope.addVoucherShow;
      }
      $scope.selvoucher = function(obj) {
        obj.sel = !obj.sel;
      }
      $scope.addVoucher = function() {
        var arr = [];
        $scope.voucherData.forEach(function(io) {
          io.sel && arr.push(io)
        });
        $scope.vouchers = arr;
        $scope.addVoucherShow = false;
      }
      $scope.closeTable = function() {
        $scope.addVoucherShow = false;
      }

      $scope.delVoucher = function(index, id) {
        $scope.vouchers.splice(index, 1);
        $scope.chkAllBtn = false;
        $scope.voucherData.forEach(function(io) {
          io.id == id && (io.sel = false)
        })
      }

      $scope.selFoodChkAll = function() {
        $scope.voucherData.forEach(function(io) {
          io.sel = $scope.chkAllBtn;
        })
      }

      $scope.submitData = function() {
        var json = {
          "promotion": {
            "name": $scope.activity,
            //"营销活动的名字"
            "exclusive": true, //$scope.meanwhile,
            //"是否排他, true or false"
            "state": 1,
            // "状态",
            "dayspan": {
              "serviceHour": null,
              // "市别",
              "beginTime": $scope.promotionBeginTime,
              //"开始日期",
              "endTime": $scope.promotionEndTime,
              // "结束日期",
              "monday": true,
              "tuesday": true,
              "wednesday": true,
              "thursday": true,
              "friday": true,
              "saturday": true,
              "sunday": true
            },
            "shops": returnShopId($scope.alreadyShopData),
            //["shop 的 id"],
            "excludes": [],
            "remark": $scope.remark
          },
          "details": returnDetails()
        }

        function returnShopId(ShopObj) {
          var shopId = [];
          ShopObj.forEach(function(io) {
            shopId.push(io.shopId)
          });
          return shopId;
        }

        function returnDetails() {
          var arr = [];
          $scope.vouchers.forEach(function(io) {
            arr.push({
              "memberType": returnMemberType(), // 会员类型
              "voucherType": io.id, // 代金券类型（有名代金券）
              "quantity": io.quantity // 赠送数量
            })
          })
          return arr
        }

        function returnMemberType() {
          for (var i = 0; i < $scope.WeixinData.length; i++) {
            if ($scope.WeixinData[i].appid == $scope.weixin) {
              return $scope.WeixinData[i].memberType.id
            }
          }
        }
        if (json.details.length == 0) {
          alert("请添加参加活动的代金券");
          return
        }
        $scope.isPosting = true;
        $http.post("/home/brand/" + brandId + "/promotion/new/13", json).success(function(res) {
          alert('提交成功');
          $state.go("promotion");
        }).error(function(error) {
          $scope.isPosting = false;
        })
      }

    }
  ])

})
