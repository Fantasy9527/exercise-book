define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller('promotion10Controller', ['$scope', '$http', '$location', 'proSrv',
    function($scope, $http, $location, proSrv) {
      $('.datepickerTime').datetimepicker();
        //添加菜品
        //proSrv.addDishes($scope, $http);
        //自定义时间
      proSrv.selTime($scope, $http);
      //选择门店
      proSrv.selShop($scope, $http, true); //第三个参数.true:过滤会员类型,false反之
      //添加不参加时间
      proSrv.nonparticipator($scope, $http);
      //参加市别
      proSrv.servicehours($scope, $http);
      //
      // $scope.DishesShow = false;
      proSrv.addDishes($scope, $http);
      $scope.VipType = [{
        id: -1,
        name: "请选择门店获取相应会员信息"
      }]

      $scope.getVipType = function(id) {
        $http.get("/home/brand/" + brandId + "/shop/" + $scope.shopValue + "/has/membertypes").success(function(res) {
            if (res.length == 0) {
              $scope.VipType = [{
                id: -1,
                name: "本门店暂无会员信息"
              }]
            } else {
              $scope.VipType = res;
              $scope.selVipType = res[0].id
            }
          })
          //按照门店获取菜品
        var url = "/home/brand/" + brandId + "/shop/" + id + "/products"
          //添加菜品
        proSrv.addDishes($scope, $http, url);
        $scope.DishesShow = true;

      }
      $scope.customMonday = true;
      $scope.customTuesday = true;
      $scope.customWednesday = true;
      $scope.customThursday = true;
      $scope.customFriday = true;
      $scope.customSaturday = true;
      $scope.customSunday = true;

      $scope.submitData = function() {
        var submitData = {
          "promotion": {
            "name": $scope.activity,
            "exclusive": true, //$scope.meanwhile,
            "state": 1,
            "memberTypes": [$scope.selVipType],
            "dayspan": returnWeekType($scope.weekChecked),
            "shops": [$scope.shopValue],
            //["shop 的 id"],,
            "excludes": returnNonpartServicehour($scope.nonparticipatorTimeData),
            "remark": $scope.remark
          },
          "data": {

          },
          "details": returnDetails()
        }

        if (submitData.promotion.shops.length == 0) {
          alert("请选择适用门店");
          return
        } else if (submitData.details.length == 0) {
          alert("请添加菜品");
          return
        } else if (proSrv.checkWeek(submitData)) {
          alert("请选择每周参加时间")
        } else if (proSrv.timeContrast(submitData.promotion.dayspan.beginTime, submitData.promotion.dayspan.endTime)) {
          alert('结束时间早于开始时间，请检查');
        } else if (submitData.data.memberType == -1) {
          alert('没有选择会员类型');
        } else {
          $scope.isPosting = true;
          $http.post("/home/brand/" + brandId + "/promotion/new/10", submitData).success(function() {
            alert('提交成功');
            $location.path("/promotion")
          }).error(function(error) {
            $scope.isPosting = false;
          })
        }

        function returnWeekType(type) {
          var weekType = [{
            type: "AllWeek",
            "serviceHour": returnServicehour($scope.selServicehour),
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
            "serviceHour": returnServicehour($scope.selServicehour),
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
            "serviceHour": returnServicehour($scope.selServicehour),
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
          if ($scope.VegetableArr == undefined) {
            alert("请添加会员价菜品");
            return
          } else {
            var result = [];
            for (var i = 0; i < $scope.VegetableArr.length; i++) {
              //console.log($scope.VegetableArr[i]);
              result.push({
                "price": $scope.VegetableArr[i].productPrice,
                "product": $scope.VegetableArr[i].product
                  /*,
                                                      "isGroup": false*/
              })
            }
            return result
          }

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
          return id
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
        //console.log(submitData)
      }

    }
  ])
})
