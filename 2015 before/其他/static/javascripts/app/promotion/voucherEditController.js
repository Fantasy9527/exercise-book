define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller("voucherEditController", ["$rootScope", '$scope', '$http', '$location', '$timeout', '$state', 'proSrv',
    function($rootScope, $scope, $http, $location, $timeout, $state, proSrv) {
      var voucherId = $state.params.voucherId;
      //自定义时间
      proSrv.selTime($scope, $http);
      //参加市别
      proSrv.servicehours($scope, $http);
      //添加不参加时间
      proSrv.nonparticipator($scope, $http);
      $scope.addShopShow = false;

      $http.get("/home/brand/" + brandId + "/voucher/" + voucherId).success(function(res) {
        console.log(res);
        $scope.model = res;

        //添加小组菜品
        proSrv.addVegeSubgroups($rootScope, $scope, $http, true, res.subgroups);
        $scope.addVegetableShow = false;
        //判断市别是否为null
        if ($scope.model.voucherType.serviceHour == null) {
          $scope.model.voucherType.serviceHour = 0
        }

        setTimeout(function() {
            $('.datepickerTime').datetimepicker();
          },
          300);
        $scope.nonparticipator = function() {
          $scope.nonparticipatorTimeData.push({
            beginTime: "",
            endTime: "",
            serviceHour: 0
          });
          setTimeout(function() {
              $('.datepickerTime').datetimepicker();
            },
            300)

        }

        $scope.effectiveType = res.voucherType.effectiveType;
        //添加门店

        var shopData = [];
        for (var i = 0; i < res.shops.length; i++) {
          shopData.push({
            Province: res.shops[i]._province.name,
            ProvinceId: res.shops[i]._province.id,
            city: res.shops[i]._city.name,
            cityId: res.shops[i]._city.id,
            shop: res.shops[i].name,
            shopId: res.shops[i].id,
            sel: true
          })
        }
        proSrv.addShop($scope, $http, pickOnShop);

        function pickOnShop() {
          console.log($scope.localAllShop)
          for (var i = 0; i < shopData.length; i++) {
            for (var j = 0; j < $scope.localAllShop.length; j++) {
              if (shopData[i].shopId == $scope.localAllShop[j].shopId) {
                $scope.localAllShop[j].sel = true
              }
            }
          };
          $scope.alreadyShopData = shopData;
        }


        $scope.submitData = function() {
          var _serviceHour = $scope.model.voucherType.serviceHour;
          if ($scope.model.voucherType.serviceHour == 0) {
            _serviceHour = null
          }

          var submitData = {
            "name": $scope.model.voucherType.name,
            "effectiveDays": $scope.model.voucherType.effectiveDays,
            "dayspan": {
              "serviceHour": _serviceHour,
              "beginTime": $scope.model.voucherType.beginTime,
              "endTime": $scope.model.voucherType.endTime,
              "monday": $scope.model.voucherType.monday,
              "tuesday": $scope.model.voucherType.tuesday,
              "wednesday": $scope.model.voucherType.wednesday,
              "thursday": $scope.model.voucherType.thursday,
              "friday": $scope.model.voucherType.friday,
              "saturday": $scope.model.voucherType.saturday,
              "sunday": $scope.model.voucherType.sunday
            },
            "shops": returnShopId($scope.alreadyShopData),
            "subgroups": returnSubgroups($scope.VegetableArr),
            "forSurcharge": $scope.model.voucherType.forSurcharge,
            "remark": $scope.model.voucherType.remark
          }


          function returnShopId(ShopObj) {
            var shopId = [];
            ShopObj.forEach(function(io) {
              shopId.push(io.shopId)
            });
            return shopId;
          }

          function returnSubgroups(obj) {
            var tml_Subgroups = [];
            for (var i = 0; i < obj.length; i++) {
              tml_Subgroups.push(obj[i].subGroupId);
            }
            return tml_Subgroups;
          }

          //($scope.model.details[0]._voucherType.beginTime);
          //console.log($scope.model.details[0]._voucherType.endTime);
          //console.log(submitData);
          if (submitData.shops.length == 0) {
            alert("请选择门店")
          } else if (submitData.subgroups.length == 0) {
            alert("请添加适用菜品范围")
          } else if (proSrv.checkWeek(submitData, true)) {
            alert("请选择每周参加时间")
          } else if (proSrv.timeContrast(submitData.dayspan.beginTime, submitData.dayspan.endTime)) {
            alert('代金券结束时间早于开始时间，请检查');
          } else {
            $scope.isPosting = true;
            $http.post("/home/brand/" + brandId + "/voucher/" + voucherId, submitData).success(function() {
              alert('提交成功');
              $state.go("voucherManage")
            }).error(function(error) {
              $scope.isPosting = false;
            })
          }

        }

      })

    }
  ])
})
