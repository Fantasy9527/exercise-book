define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller('promotion9Controller', ['$scope', '$http', '$location', 'proSrv',
    function($scope, $http, $location, proSrv) {
      //选择时间
      $('.datepickerTime').datetimepicker();
      //门店三联菜单
      //  proSrv.selShop($scope, $http, true); //第三个参数.true:过滤会员类型,false反之
      //自定义时间
      proSrv.selTime($scope, $http);
      //添加不参加时间
      proSrv.nonparticipator($scope, $http);
      //参加市别
      proSrv.servicehours($scope, $http);
      //充值赠送规则
      $scope.customMonday = true;
      $scope.customTuesday = true;
      $scope.customWednesday = true;
      $scope.customThursday = true;
      $scope.customFriday = true;
      $scope.customSaturday = true;
      $scope.customSunday = true;

      $scope.memberTypes = [{
        id: -1,
        name: "请选择门店获取相应会员信息"
      }];

      $http.get("/home/brand/" + brandId + "/promotion/membertypes").success(function(res) {
        $scope.memberTypes = res.memberTypes;;
        $scope.selMemberType = $scope.memberTypes[0].id;
      })
      $scope.rechargeData = [{
        value: 50,
        money: "",
        selected: false
      }, {
        value: 100,
        money: "",
        selected: false
      }, {
        value: 200,
        money: "",
        selected: false
      }, {
        value: 500,
        money: "",
        selected: false
      }, {
        value: 1000,
        money: "",
        selected: false
      }, {
        value: 2000,
        money: "",
        selected: false
      }, {
        value: 5000,
        money: "",
        selected: false
      }, {
        value: 10000,
        money: "",
        selected: false
      }]

      $scope.Recharge = function(index) {
        $scope.rechargeData[index].selected = !$scope.rechargeData[index].selected;
      }

      $scope.submitData = function() {
        var submitData = {
          "promotion": {
            "name": $scope.activity,
            "exclusive": true, //$scope.meanwhile,
            "state": 1,
            "memberTypes": [$scope.selMemberType],
            "dayspan": returnWeekType($scope.weekChecked),
            "shops": [],
            //["shop 的 id"],,
            "excludes": returnNonpartServicehour($scope.nonparticipatorTimeData),
            "remark": $scope.remark
          },

          "details": returnDetails()
        }

        if (submitData.details.length == 0) {
          alert("请添加菜品");
          return
        } else if (proSrv.checkWeek(submitData)) {
          alert("请选择每周参加时间")
        } else if (proSrv.timeContrast(submitData.promotion.dayspan.beginTime, submitData.promotion.dayspan.endTime)) {
          alert('结束时间早于开始时间，请检查');
        }
        else {
          $scope.isPosting = true;
          $http.post("/home/brand/" + brandId + "/promotion/new/9", submitData).success(function() {
            alert('提交成功');
            $location.path("/promotion")
          }).error(function(error) {
            $scope.isPosting = false;
          })
        }

        function returnWeekType(type) {
          var weekType = [{
            type: "AllWeek",
            "serviceHour": null,
            // "市别",
            "beginTime": $scope.promotionBeginTime,
            //"开始日期",
            "endTime": $scope.promotionEndTime,
            // "结束日期",
            //name: "周一至周日",
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
            "serviceHour": null,
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
            "saturday": "false",
            "sunday": "false"

          }, {
            type: "weekend",
            //name: "周日至周六",
            "serviceHour": null,
            // "市别",
            "beginTime": $scope.promotionBeginTime,
            //"开始日期",
            "endTime": $scope.promotionEndTime,
            // "结束日期",
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
                  "serviceHour": returnServicehour($scope.selServicehour),
                  // "市别",
                  "beginTime": $scope.promotionBeginTime,
                  //"开始日期",
                  "endTime": $scope.promotionEndTime,
                  // "结束日期",
                  monday: $scope.customMonday,
                  tuesday: $scope.customTuesday,
                  wednesday: $scope.customWednesday,
                  thursday: $scope.customThursday,
                  friday: $scope.customFriday,
                  saturday: $scope.customSaturday,
                  sunday: $scope.customSunday
                }
                return customWeek
              } else {
                return weekType[i];
              }
            }

          }
        }

        function returnDetails() {
          var result = [];
          $scope.rechargeData.forEach(function(io) {
            if (io.selected == true) {
              result.push({
                "charge": io.value,
                "gift": io.money
              })
            }

          });
          return result;
        }

        function returnShopId(ShopObj) {
          var shopId = [];
          ShopObj.forEach(function(io) {
            shopId.push(io.shopId)
          });
          return shopId;
        }
        //处理市别
        function returnServicehour(id) {
          if (id == 0) {
            return null
          }
          return id;
        }

        function returnNonpartServicehour(obj) {
          var tmparr = [];
          angular.copy(obj, tmparr);
          tmparr.forEach(function(io, index) {
            if (io.serviceHour == "") {
              io.serviceHour = null
            }
          });
          return tmparr;
        }
        //(submitData)
      }

    }
  ])
})
