define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller('promotion11Controller', ["$rootScope", '$scope', '$http', '$location', '$timeout', 'proSrv',
    function($rootScope, $scope, $http, $location, $timeout, proSrv) {
      //选择门店
      proSrv.selShop($scope, $http);
      //添加不参加时间
      proSrv.nonparticipator($scope, $http);
      //参加市别
      proSrv.servicehours($scope, $http);

      proSrv.selTime($scope, $http);
      $scope.preweekChecked = "AllWeek";
      $scope.remark = "";
      $scope.meanwhile = false;
      $scope.customMonday = true;
      $scope.customTuesday = true;
      $scope.customWednesday = true;
      $scope.customThursday = true;
      $scope.customFriday = true;
      $scope.customSaturday = true;
      $scope.customSunday = true;


      $scope.discountShow = false;
      $scope.VipType = [{
        id: -1,
        name: "请选择门店获取相应会员信息"
      }];
      $scope.staffRoles = [{
        name: '请选择门店获取授权岗位',
        sel: false
      }]

      $scope.getVipType = function() {
        $http.get("/home/brand/" + brandId + "/shop/" + $scope.shopValue + "/has/membertypes").success(function(res) {
          if (res.length == 0) {
            $scope.VipType = [{
              id: -1,
              name: "此门店没有会员信息"
            }]
          } else {
            res.forEach(function(indxObj) {
              indxObj.sel = false;
            })
            $scope.VipType = res;
            //console.log(res);
            $scope.selVipType = res[0].id
          }

          $http({
            method: "get",
            url: "/home/brand/" + brandId + "/promotion/shop/" + $scope.shopValue + "/base",
            cache: true
          }).success(function(data) {
            //console.log(data);
            $scope.discountShow = true;
            data.staffRoles.forEach(function(io) {
              io.sel = false;
            });
            $scope.staffRoles = data.staffRoles;
            data.subgroups.forEach(function(io) {
              io.show = true;
              io.sel = false;
              data.goodsgroups.forEach(function(obj) {
                obj.sel = false;
                if (io.group == obj.id) {
                  io.goodsGroup = angular.copy(obj);
                }
              })

            })
            $scope.goodsSubGroups = data.subgroups;
            $scope.goodsGroups = data.goodsgroups;

          })

        })
      }



      $scope.selGoodsSub = function(obj) {
        obj.sel = !obj.sel;
        var selNum = 0;
        $scope.goodsSubGroups.forEach(function(io) {
          if (io.sel) {
            selNum++;
          }
        });
        if (selNum > 0) {
          $scope.batch = true;
        } else {
          $scope.batch = false;
        }
      };

      $scope.selGoodsSubAll = function() {
        $scope.batch = $scope.chkAllBtn;
        $scope.goodsSubGroups.forEach(function(io) {
          if (io.show) {
            io.sel = $scope.chkAllBtn;
          }
        });
      };

      $scope.batchFn = function() {
        $scope.goodsSubGroups.forEach(function(io) {
          if (io.show && io.sel) {
            io.percentage = $scope.batchData;
            io.sel = false;
          }
        });
      };

      $scope.percentageChange = function(obj) {
        if (obj.percentage > 100) {
          obj.percentage = 100
        }

        if (obj.percentage < 0) {
          obj.percentage = 0
        }


      };
      $scope.batchDataChange = function() {
        if ($scope.batchData > 100) {
          $scope.batchData = 100;
        };
        if ($scope.batchData < 0) {
          $scope.batchData = 0;
        }
      };


      $scope.submitData = function() {
        var data = {
          promotion: {
            name: $scope.activity,
            "exclusive": true, //$scope.meanwhile,
            dayspan: returnWeekType($scope.weekChecked),
            staffRoles: returnStaffRole(), //授权角色ID
            memberTypes: returnMemberType(), //会员类型
            state: 1,
            shops: [$scope.shopValue], // 做活动的门店信息
            excludes: returnNonpartServicehour($scope.nonparticipatorTimeData),
            remark: $scope.remark
          },
          details: returnDiscountPlans()
        };


        if (data.promotion.shops.length == 0) {
          alert("请选择门店")
        } else if (data.details.length == 0) {
          alert("请添加小类折扣")
        } else if (proSrv.checkWeek(data)) {
          alert("请选择每周参加时间")
        } else if (returnMemberType().length == 0) {
          alert("请选择会员类型")
        } else if (proSrv.timeContrast($scope.promotionBeginTime, $scope.promotionEndTime)) {
          alert('活动结束时间早于开始时间，请检查');
        } else {
          $scope.isPosting = true
          $http.post("/home/brand/" + brandId + "/promotion/new/11", data).success(function() {
            alert('提交成功');
            $location.path("/promotion");
          }).error(function(error) {
            $scope.isPosting = false;
          })
        }

        function returnMemberType() {
          var arr = [];
          $scope.VipType.forEach(function(io) {
            if (io.sel) {
              arr.push(io.id)
            }

          });
          return arr;

        }

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

        function returnDiscountPlans() {
          var arr = [];
          $scope.goodsSubGroups.forEach(function(io) {
            var num = io.percentage;
            //console.log(num);
            if (num != '' && !isNaN(num) && num >= 0 && num <= 100)
              arr.push({
                subgroup: io.id,
                percentage: io.percentage
              })
          });
          return arr;
        }

        function returnStaffRole() {
          var arr = [];
          $scope.staffRoles.forEach(function(io) {
            if (io.sel) {
              arr.push(io.id)
            }
          });
          return arr;

        }
        //处理市别
        function returnServicehour(id) {
          if (id == "") {
            return null
          }
          return id
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

      };


      $scope.goodsGroupDress = function(obj) {
        //console.log(obj);
        $scope.goodsGroups.forEach(function(io) {
          io.sel = false;
        });
        obj.sel = true;
        $(".goods-group-all").removeClass("bg-success");
        $scope.goodsSubGroups.forEach(function(io) {
          if (io.goodsGroup.id == obj.id) {
            io.show = true;
          } else {
            io.show = false;
          }
        });
      };

      $scope.goodsGroupDressAll = function() {
        $scope.goodsGroups.forEach(function(io) {
          io.sel = false;
        });
        $(".goods-group-all").addClass("bg-success");
        $scope.goodsSubGroups.forEach(function(io) {
          io.show = true;
        });
      }
    }
  ]);
});
