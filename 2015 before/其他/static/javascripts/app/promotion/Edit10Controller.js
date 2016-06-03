define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
app.controller("Edit10Controller", ["$rootScope", '$scope', '$http', '$location', '$timeout', 'proSrv',
  function ($rootScope, $scope, $http, $location, $timeout, proSrv) {
    //自定义时间
    proSrv.selTime($scope, $http);
    //参加市别
    proSrv.servicehours($scope, $http);
    //添加不参加时间
    proSrv.nonparticipator($scope, $http);
    //添加门店
    proSrv.addShop($scope, $http);
    $http.get("/home/brand/" + brandId + "/promotion/" + $location.search().id).success(function (res) {
      ////console.log(res);
      $scope.promotionData = res;
      ////console.log(proSrv);
      if ($scope.promotionData.promotion._serviceHour == null) {
        $scope.selServicehour = 0
      } else {
        $scope.selServicehour = $scope.promotionData.promotion._serviceHour.id
      }

      $http.get("/home/brand/" + brandId + "/shop/" + $scope.promotionData.promotion.shops[0].id + "/has/membertypes").success(function (res) {
        if (res.length == 0) {
          $scope.VipType = [{
            id: -1,
            name: "本门店暂无会员信息"
                  }]
        } else {
          $scope.VipType = res;
        }
      });
      $scope.selVipName = $scope.promotionData.promotion.memberTypes[0].name;
      //不参加活动时间
      var nonparticipatorTimeData = [];
      for (var i = 0; i < res.promotion.excludes.length; i++) {
        //(res.promotion.excludes[i]);
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
      setTimeout(function () {
          $('.datepickerTime').datetimepicker();
        },
        300);
      $scope.nonparticipator = function () {
        $scope.nonparticipatorTimeData.push({
          beginTime: "",
          endTime: "",
          serviceHour: 0
        });
        setTimeout(function () {
            $('.datepickerTime').datetimepicker();
          },
          300)
      }
      $scope.delNonparticipator = function (index) {
        $scope.nonparticipatorTimeData.splice(index, 1)
      }

      //选择菜品
      var url = "/home/brand/" + brandId + "/shop/" + $scope.promotionData.promotion.shops[0].id + "/products"
      proSrv.addDishes($scope, $http, url, true, res);
      $scope.addVegetableShow = true;

      $scope.submitData = function () {
        var _serviceHour = $scope.selServicehour;
        if ($scope.selServicehour == 0) {
          _serviceHour = null
        }

        function returnNonpartServicehour(obj) {
          var tmparr = [];
          angular.copy(obj, tmparr);
          tmparr.forEach(function (io, index) {
            if (io.serviceHour == 0) {
              io.serviceHour = null
            }
          });
          return tmparr;
        }
        var promotion=$scope.promotionData.promotion;
        var submitData = {
          "promotion": {
            "name": promotion.name,
            "exclusive": true, //promotion.exclusive,
            "state": 1,
            "memberTypes": [promotion.memberTypes[0].id],
            "dayspan": {
              "serviceHour": _serviceHour,
              "beginTime": promotion.beginTime,
              "endTime": promotion.endTime,
              "monday": promotion.monday,
              "tuesday": promotion.tuesday,
              "wednesday": promotion.wednesday,
              "thursday": promotion.thursday,
              "friday": promotion.friday,
              "saturday": promotion.saturday,
              "sunday": promotion.sunday
            },
            "shops": [promotion.shops[0].id],
            "excludes": returnNonpartServicehour($scope.nonparticipatorTimeData),
            "remark": promotion.remark
          },
          "details": changeVegetableArr()
        }

        ////console.log(submitData);

        function excludesTimeContrast() {
          for (var i = 0; i < submitData.promotion.excludes.length; i++) {
            if (proSrv.timeContrast(submitData.promotion.excludes[i].beginTime, submitData.promotion.excludes[i].endTime)) {
              return true
            }
          }
        }

        function changeVegetableArr() {
          //console.log($scope.VegetableArr);
          $scope.VegetableArr.forEach(function (obj) {
            obj.price = obj.vipPrice;
          });
          return $scope.VegetableArr;
        }

        if (submitData.details.length == 0) {
          alert("请添加会员菜品")
        } else if (proSrv.checkWeek(submitData)) {
          alert("请选择每周参加时间")
        } else if (proSrv.timeContrast($scope.promotionData.promotion.beginTime, $scope.promotionData.promotion.endTime)) {
          alert('结束时间早于开始时间，请检查');
        } else if (excludesTimeContrast()) {
          alert("不参加活动时间段 结束时间早于开始时间")
        } else {
          $scope.isPosting=true;
          $http.post("/home/brand/" + brandId + "/promotion/" + $location.search().id, submitData).success(function () {
            alert('提交成功');
            $location.path("/promotion")
          }).error(function(error){
        $scope.isPosting=false;
      })
        }
      }

    })

  }
])
})
