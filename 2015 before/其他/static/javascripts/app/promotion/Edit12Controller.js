define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
  app.controller('Edit12Controller', ["$rootScope", '$scope', '$http', '$location', "$state", 'proSrv',
    function ($rootScope, $scope, $http, $location, $state, proSrv) {
      $('.datepickerTime').datetimepicker();
      $scope.vouchers = [];
      $http.get("/home/brand/" + brandId + "/promotion/" + $location.search().id).success(function (res) {
        //console.log(res);
        $scope.promotionData = res;
        $http.get("/home/brand/" + brandId + "/promotion/weixin").success(function (weixin) {
          console.log(weixin);
          $scope.WeixinData = weixin.weixins;
          $scope.weixin = res.details[0]._weixin.appid;
          $scope.voucherData = weixin.voucherTypes;
          $scope.vouchers = res.details.map(function (io) {
            io.name = io._voucherType.name;
            return io;
          });
          $scope.voucherData.forEach(function (voucherData) {
            $scope.vouchers.forEach(function (vouchers) {
              if (voucherData.id == vouchers._voucherType.id) {
                voucherData.sel = true;
              }
            })
          })
        })
      })


      //代金券
      $scope.addVoucherShow = false;
      $scope.addVoucherTable = function () {
        $scope.addVoucherShow = !$scope.addVoucherShow;
      }
      $scope.selvoucher = function (obj) {
        obj.sel = !obj.sel;
      }
      $scope.addVoucher = function () {
        var arr = [];
        $scope.voucherData.forEach(function (io) {
          if (io.sel) {
            io.voucherType = io.id;
            arr.push(io);
          }
        });
        $scope.vouchers = arr;
        $scope.addVoucherShow = false;
      }
      $scope.closeTable = function () {
        $scope.addVoucherShow = false;
      }

      $scope.delVoucher = function (index, voucherType) {
        $scope.vouchers.splice(index, 1);
        $scope.chkAllBtn = false;
        $scope.voucherData.forEach(function (io) {
          io.id == voucherType && (io.sel = false)
        })
      }

      $scope.selFoodChkAll = function () {
        $scope.voucherData.forEach(function (io) {
          io.sel = $scope.chkAllBtn;
        })
      }

      $scope.submitData = function () {

        var json = {
          "promotion": {
            "name": $scope.promotionData.promotion.name,
            //"营销活动的名字"
            "exclusive": true, //$scope.meanwhile,
            //"是否排他, true or false"
            "state": 1,
            // "状态",
            "dayspan": {
              "serviceHour": null,
              // "市别",
              "beginTime": $scope.promotionData.promotion.beginTime,
              //"开始日期",
              "endTime": $scope.promotionData.promotion.endTime,
              // "结束日期",
              "monday": true,
              "tuesday": true,
              "wednesday": true,
              "thursday": true,
              "friday": true,
              "saturday": true,
              "sunday": true
            },
            "shops": [],
            //["shop 的 id"],
            "excludes": [],
            "remark": $scope.promotionData.promotion.remark
          },
          "details": returnDetails()
        }

        function returnDetails() {
          var arr = [];
          var memberType = $scope.promotionData.promotion.memberTypes[0].id;
          $scope.vouchers.forEach(function (io) {
            arr.push({
              "memberType": memberType, // 会员类型
              "voucherType": io.voucherType, // 代金券类型（有名代金券）编辑跟新增取的属性不一样
              "quantity": io.quantity // 赠送数量
            })
          })
          return arr
        }



        if (json.details.length == 0) {
          alert("请添加参加活动的代金券");
          return
        }
        $scope.isPosting=true;
        $http.post("/home/brand/" + brandId + "/promotion/" + $location.search().id, json).success(function (res) {
          alert("提交成功");
          $location.path("/promotion");
        }).error(function(error){
          $scope.isPosting=false;
        })
      }





    }])
})
