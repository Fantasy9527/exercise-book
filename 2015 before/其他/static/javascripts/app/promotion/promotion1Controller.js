define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller('promotion1Controller', ['$scope', '$http', '$location', 'proSrv',
    function($scope, $http, $location, proSrv) {
      //选择门店
      proSrv.selShop($scope, $http);
      //自定义时间
      proSrv.selTime($scope, $http);
      //添加不参加时间
      proSrv.nonparticipator($scope, $http);
      //参加市别
      proSrv.servicehours($scope, $http);

      $scope.meanwhile = false;
      $scope.customMonday = true;
      $scope.customTuesday = true;
      $scope.customWednesday = true;
      $scope.customThursday = true;
      $scope.customFriday = true;
      $scope.customSaturday = true;
      $scope.customSunday = true;
      $scope.DishesShow = false;
      //结束时间早于开始时间默认隐藏
      $scope.warningTime = false;
      proSrv.addDishes($scope, $http);
      $scope.shopeChange = function(id) {
        var url = "/home/brand/" + brandId + "/shop/" + id + "/products"
          //添加菜品
        proSrv.addDishes($scope, $http, url);
      }

      $scope.submitData = function() {
        if ($scope.shopValue == 0) {
          alert("参加的门店不能为空")
        } else if (!$scope.VegetableArr || $scope.VegetableArr.length == 0) {
          alert("请添加菜品")
        } else {
          var weekTypeData = returnWeekType($scope.weekChecked);
          var submitData = {
              "promotion": {
                "name": $scope.activity,
                //"营销活动的名字"
                "exclusive": true, //$scope.meanwhile,
                //"是否排他, true or false"
                "state": 1,
                // "状态",
                "dayspan": {
                  "serviceHour": returnServicehour($scope.selServicehour),
                  // "市别",
                  "beginTime": $scope.promotionBeginTime,
                  //"开始日期",
                  "endTime": $scope.promotionEndTime,
                  // "结束日期",
                  "monday": weekTypeData.monday,
                  "tuesday": weekTypeData.tuesday,
                  "wednesday": weekTypeData.wednesday,
                  "thursday": weekTypeData.thursday,
                  "friday": weekTypeData.friday,
                  "saturday": weekTypeData.saturday,
                  "sunday": weekTypeData.sunday
                },
                "shops": [$scope.shopValue],
                //["shop 的 id"],
                "excludes": returnNonpartServicehour($scope.nonparticipatorTimeData),
                "remark": $scope.remark
              },
              "details": returnDetails()
            }
            //console.log(submitData);

          function excludesTimeContrast() {
            for (var i = 0; i < submitData.promotion.excludes.length; i++) {
              if (proSrv.timeContrast(submitData.promotion.excludes[i].beginTime, submitData.promotion.excludes[i].endTime)) {
                return true
              }

            }

          }

          if (proSrv.checkWeek(submitData)) {
            alert("请选择每周参加时间")
          } else if (proSrv.timeContrast(submitData.promotion.dayspan.beginTime, submitData.promotion.dayspan.endTime)) {
            alert('结束时间早于开始时间，请检查');
            // $scope.warningTime = true;
            // $(".errorTime").animatescroll({scrollSpeed:1300,easing:'easeOutElastic',padding:50})
          } else if (excludesTimeContrast()) {
            alert("不参加活动时间段 结束时间早于开始时间")
          } else {
            $scope.isPosting = true;
            $http.post("/home/brand/" + brandId + "/promotion/new/1", submitData).success(function() {
              alert('提交成功');
              $location.path("/promotion")
            }).error(function(error) {
              $scope.isPosting = false;
            })
          }

        }
      }

      function returnDetails() {
        var result = [];
        for (var i = 0; i < $scope.VegetableArr.length; i++) {
          result.push({
            "product": $scope.VegetableArr[i].product,
            "price": $scope.VegetableArr[i].productPrice,
            "isGroup": false
          })
        }
        return result
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

      //处理市别
      function returnServicehour(id) {
        if (id == "") {
          return null
        }
        return id
      }

      function returnVegetableId(VegetableArr) {
        var VegetableId = [];
        if (VegetableArr.length == 0) {
          alert("请选择菜品");
        } else {
          VegetableArr.forEach(function(io) {
            VegetableId.push(io.subGroupId)
          });
          return VegetableId;
        }

      }

      function returnWeekType(type) {
        var weekType = [{
          type: "AllWeek",
          name: "周一至周日",
          "monday": "true",
          "tuesday": "true",
          "wednesday": "true",
          "thursday": "true",
          "friday": "true",
          "saturday": "true",
          "sunday": "true"
        }, {
          type: "manDay",
          name: "周一至周五",
          "monday": "true",
          "tuesday": "true",
          "wednesday": "true",
          "thursday": "true",
          "friday": "true",
          "saturday": "false",
          "sunday": "false"

        }, {
          type: "weekend",
          name: "周日至周六",
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
    }
  ])
})
