define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller("Edit1Controller", ["$rootScope", '$scope', '$http', '$location', '$timeout', 'proSrv',
    function($rootScope, $scope, $http, $location, $timeout, proSrv) {
      //参加市别
      proSrv.servicehours($scope, $http);
      $http.get("/home/brand/" + brandId + "/promotion/" + $location.search().id).success(function(res) {
        //console.log(res);
        $scope.promotionData = res;
        $scope.details = res.details;

        function returnShop(obj) {
          var shopStr = "";
          obj.forEach(function(io) {
            shopStr += (io.name + "  ")
          });
          return shopStr
        }

        $scope.weekDay = function(oWeek) {
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

        $scope.promotionWeek = $scope.weekDay(res.promotion);
        $scope.promotionShop = returnShop(res.promotion.shops);
        $scope.promotionTime = $scope.weekDay(res.details._voucherType);
        $scope.promotionServiceHourId = ServiceHourId(res.promotion._serviceHour);
        //是null转成""
        function ServiceHourId(data) {
          if (data == null) {
            return 0
          } else {
            return data.id
          }
        }

        var nonparticipatorTimeData = [];
        for (var i = 0; i < res.promotion.excludes.length; i++) {
          nonparticipatorTimeData.push({
            beginTime: res.promotion.excludes[i].beginDate,
            endTime: res.promotion.excludes[i].endDate,
            serviceHour: returnServiceHourName(res.promotion.excludes[i]._serviceHour)
          })
        }
        $scope.nonparticipatorTimeData = nonparticipatorTimeData;

        //console.log($scope.nonparticipatorTimeData)
        //空字符串转成null
        function returnServiceHourName(obj) {
          if (obj == null) {
            return 0
          } else {
            return obj.id
          }
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

        $scope.delNonparticipator = function(index) {
          $scope.nonparticipatorTimeData.splice(index, 1)
        }

        $scope.submitData = function() {
          var submitData = {
            "promotion": {
              "name": $scope.promotionData.promotion.name,
              "exclusive": true, //$scope.promotionData.promotion.exclusive,
              "state": $scope.promotionData.promotion._state.id,
              "dayspan": {
                "serviceHour": returnServiceHour($scope.promotionServiceHourId),
                "beginTime": $scope.promotionData.promotion.beginTime,
                "endTime": $scope.promotionData.promotion.endTime,
                "monday": $scope.promotionData.promotion.monday,
                "tuesday": $scope.promotionData.promotion.tuesday,
                "wednesday": $scope.promotionData.promotion.wednesday,
                "thursday": $scope.promotionData.promotion.thursday,
                "friday": $scope.promotionData.promotion.friday,
                "saturday": $scope.promotionData.promotion.saturday,
                "sunday": $scope.promotionData.promotion.sunday
              },
              "shops": returnShopId(),
              "excludes": filterNonpartServer(),
              "remark": $scope.promotionData.promotion.remark
            },
            "details": res.details

          }

          //发送数据的时候 空字符串转成null
          function filterNonpartServer() {
            for (var i = 0; i < $scope.nonparticipatorTimeData.length; i++) {
              if ($scope.nonparticipatorTimeData[i].serviceHour == 0) {
                $scope.nonparticipatorTimeData[i].serviceHour = null
              }
            }
            return $scope.nonparticipatorTimeData;
          }

          function returnServiceHour(id) {
            if (id == 0) {
              return null
            } else {
              return id
            }

          }

          function returnShopId() {
            var shopId = [];
            for (var i = 0; i < res.promotion.shops.length; i++) {
              shopId.push(res.promotion.shops[i].id);
            }
            return shopId;

          }

          function excludesTimeContrast() {
            for (var i = 0; i < submitData.promotion.excludes.length; i++) {
              if (proSrv.timeContrast(submitData.promotion.excludes[i].beginTime, submitData.promotion.excludes[i].endTime)) {
                return true
              }
            }
          }

          if (proSrv.checkWeek(submitData)) {
            alert("请选择每周参加时间")
          } else if (proSrv.timeContrast($scope.promotionData.promotion.beginTime, $scope.promotionData.promotion.endTime)) {
            alert('活动结束时间早于开始时间，请检查');
          } else if (excludesTimeContrast()) {
            alert("不参加活动时间段 结束时间早于开始时间")
          } else {
            $scope.isPosting = true;
            $http.post("/home/brand/" + brandId + "/promotion/" + $location.search().id, submitData).success(function() {
              alert('提交成功');
              $location.path("/promotion");
            }).error(function(error) {
              $scope.isPosting = false;
            })

          }

        }
      })

    }
  ])
})
