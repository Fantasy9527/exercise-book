define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller("Edit9Controller", ["$rootScope", '$scope', '$http', '$location', '$timeout', 'proSrv',
    function($rootScope, $scope, $http, $location, $timeout, proSrv) {
      //自定义时间
      proSrv.selTime($scope, $http);
      //参加市别
      proSrv.servicehours($scope, $http);
      //添加不参加时间
      proSrv.nonparticipator($scope, $http);

      $http.get("/home/brand/" + brandId + "/promotion/" + $location.search().id).success(function(res) {
        $scope.promotionData = res;
        $scope.selVipName = $scope.promotionData.promotion.memberTypes[0].name;
        $scope.rechargeData = [{
          charge: 50,
          gift: "",
          selected: false
        }, {
          charge: 100,
          gift: "",
          selected: false
        }, {
          charge: 200,
          gift: "",
          selected: false
        }, {
          charge: 500,
          gift: "",
          selected: false
        }, {
          charge: 1000,
          gift: "",
          selected: false
        }, {
          charge: 2000,
          gift: "",
          selected: false
        }, {
          charge: 5000,
          gift: "",
          selected: false
        }, {
          charge: 10000,
          gift: "",
          selected: false
        }]

        $scope.Recharge = function(index) {
          $scope.rechargeData[index].selected = !$scope.rechargeData[index].selected;
        }
        $scope.promotionData.details.forEach(function(io) {
          $scope.rechargeData.forEach(function(io2) {
            if (io.charge == io2.charge) {
              io2.gift = io.gift;
              io2.selected = true;
            }
          })
        })

        //参加市别
        $scope.promotionServiceHour = isServiceHourNull(res.promotion._serviceHour);

        function isServiceHourNull(obj) {
          if (obj == null) {
            return "全天"
          }
          return obj.name;
        }
        //不参加活动时间
        var nonparticipatorTimeData = [];
        for (var i = 0; i < res.promotion.excludes.length; i++) {
          ////console.log(res.promotion.excludes[i]);
          if (res.promotion.excludes[i]._serviceHour == null) {
            nonparticipatorTimeData.push({
              beginTime: res.promotion.excludes[i].beginDate,
              endTime: res.promotion.excludes[i].beginDate,
              serviceHour: 0
            })
          } else {
            nonparticipatorTimeData.push({
              beginTime: res.promotion.excludes[i].beginDate,
              endTime: res.promotion.excludes[i].beginDate,
              serviceHour: res.promotion.excludes[i].serviceHour
            })
          }
        }

        //不参加时间段
        $scope.nonparticipatorTimeData = nonparticipatorTimeData;
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
      })

      function returnNonpartServicehour(obj) {
        var tmparr = [];
        angular.copy(obj, tmparr);
        tmparr.forEach(function(io, index) {
          if (io.serviceHour == 0) {
            io.serviceHour = null
          }
        });
        return tmparr;
      }
      $scope.submitData = function() {
        var submitData = {
          "promotion": {
            "name": $scope.promotionData.promotion.name,
            "exclusive": true, // $scope.promotionData.promotion.exclusive,
            "state": 1,
            "memberTypes": [$scope.promotionData.promotion.memberTypes[0].id],
            "dayspan": {
              "serviceHour": null,
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
            "shops": [],
            "excludes": returnNonpartServicehour($scope.nonparticipatorTimeData),
            "remark": $scope.promotionData.promotion.remark
          },
          "details": returnRechargeData()
        }

        ////console.log(submitData);

        function excludesTimeContrast() {
          for (var i = 0; i < submitData.promotion.excludes.length; i++) {
            if (proSrv.timeContrast(submitData.promotion.excludes[i].beginTime, submitData.promotion.excludes[i].endTime)) {
              return true
            }
          }
        }

        function returnRechargeData() {
          var result = [];
          $scope.rechargeData.forEach(function(io) {
            if (io.selected == true) {
              result.push({
                "charge": io.charge,
                "gift": io.gift
              })
            }
          });
          return result;
        }

        if (submitData.details.length == 0) {
          alert("至少有一个充值规则")
        } else if (proSrv.checkWeek(submitData)) {
          alert("请选择每周参加时间")
        } else if (proSrv.timeContrast($scope.promotionData.promotion.beginTime, $scope.promotionData.promotion.endTime)) {
          alert('结束时间早于开始时间，请检查');
        } else if (excludesTimeContrast()) {
          alert("不参加活动时间段 结束时间早于开始时间")
        } else {
          $scope.isPosting = true;
          $http.post("/home/brand/" + brandId + "/promotion/" + $location.search().id, submitData).success(function() {
            alert('提交成功');
            $location.path("/promotion")
          }).error(function(error) {
            $scope.isPosting = false;
          })
        }
      }


    }
  ])
})
