define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.controller('Edit11Controller', ["$rootScope", '$scope', '$http', '$location', '$timeout', 'proSrv',
    function($rootScope, $scope, $http, $location, $timeout, proSrv) {
      //自定义时间
      proSrv.selTime($scope, $http);
      //参加市别
      proSrv.servicehours($scope, $http);
      //添加不参加时间
      proSrv.nonparticipator($scope, $http);
      $http.get("/home/brand/" + brandId + "/promotion/" + $location.search().id).success(function(res) {
        console.log(res)
        console.log(res.promotion.shops[0].id)
          //不参加活动时间
        var nonparticipatorTimeData = [];
        for (var i = 0; i < res.promotion.excludes.length; i++) {
          //console.log(res.promotion.excludes[i]);
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
        };
        $scope.delNonparticipator = function(index) {
          $scope.nonparticipatorTimeData.splice(index, 1)
        };

        $http({
          method: "get",
          url: "/home/brand/" + brandId + "/promotion/shop/" + res.promotion.shops[0].id + "/base",
          cache: true
        }).success(function(_res) {
          $http.get("/home/brand/" + brandId + "/shop/" + res.promotion.shops[0].id + "/has/membertypes").success(function(member) {
            console.log(member);
            console.log(_res);
            res.promotion.shopHasMemberTypes = member;
            res.promotion.shopHasMemberTypes.forEach(function(io) {
              io.sel = false;
              res.promotion.memberTypes.forEach(function(obj) {
                if (io.id == obj.id) {
                  io.sel = true
                }

              })

            });

            _res.subgroups.forEach(function(indexSubGroup) {
              _res.goodsgroups.forEach(function(indexGroup) {
                indexGroup.sel = false;
                if (indexSubGroup.group == indexGroup.id) {
                  indexSubGroup.goodsGroup = angular.copy(indexGroup)
                }
              })

            });

            _res.subgroups.forEach(function(indexSubGroup) {
              indexSubGroup.percentage = '';
              for (var i = 0; i < res.details.length; i++) {
                indexSubGroup.percentage = "";
                if (indexSubGroup.id == res.details[i].subgroup) {
                  indexSubGroup.show = true;
                  indexSubGroup.sel = false;
                  indexSubGroup.detail = angular.copy(res.details[i]);
                  indexSubGroup.percentage = indexSubGroup.detail.percentage;
                  break;
                } else {
                  indexSubGroup.detail = ""
                  indexSubGroup.show = true;
                  indexSubGroup.sel = false;
                }

              }

            });

            _res.staffRoles.forEach(function(io) {
              io.sel = false;
              res.promotion.staffRoles.forEach(function(obj) {
                if (io.id == obj.id) {
                  io.sel = true;
                }

              })

            });
            res.data = {
              goodsGroups: _res.goodsgroups,
              goodsSubGroups: _res.subgroups

            };
            res.promotion.allStaffRoles = _res.staffRoles;


            $scope.submitData = function() {
              var data = {
                promotion: {
                  name: $scope.promotionData.promotion.name,
                  exclusive: true, //$scope.promotionData.promotion.exclusive, //是否独有
                  state: 1,
                  dayspan: {
                    beginTime: $scope.promotionData.promotion.beginTime,
                    endTime: $scope.promotionData.promotion.endTime,
                    monday: $scope.promotionData.promotion.monday,
                    tuesday: $scope.promotionData.promotion.tuesday,
                    wednesday: $scope.promotionData.promotion.wednesday,
                    thursday: $scope.promotionData.promotion.thursday,
                    friday: $scope.promotionData.promotion.friday,
                    saturday: $scope.promotionData.promotion.saturday,
                    sunday: $scope.promotionData.promotion.sunday,
                    serviceHour: null
                  },
                  staffRoles: staffRole(), //授权角色ID
                  memberTypes: returnMembertype(), //会员类型
                  shops: [$scope.promotionData.promotion.shops[0].id], // 做活动的门店信息
                  excludes: returnNonpartServicehour($scope.nonparticipatorTimeData),
                  remark: $scope.promotionData.promotion.remark
                },
                details: returnDetails()
              };

              function staffRole() {
                var arr = [];
                res.promotion.allStaffRoles.forEach(function(io) {
                  if (io.sel) {
                    arr.push(io.id)
                  }
                });
                return arr
              }

              function returnMembertype() {
                var arr = [];
                $scope.promotionData.promotion.shopHasMemberTypes.forEach(function(io) {
                  if (io.sel) {
                    arr.push(io.id)
                  }

                })
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

              function returnDetails() {
                var arr = [];

                $scope.promotionData.data.goodsSubGroups.forEach(function(io) {
                  var num = io.percentage;
                  if (num !== '' && !isNaN(num) && num >= 0 && num <= 100) {
                    //console.log(io.percentage)
                    arr.push({
                      subgroup: io.id,
                      percentage: io.percentage
                    })
                  }
                });
                return arr;
              }

              //console.log(data)

              if (data.details.length == 0) {
                alert("请添加小类折扣")
              } else if (proSrv.checkWeek(data)) {
                alert("请选择每周参加时间")
              } else if (returnMembertype().length == 0) {
                alert("请选择会员类型")
              } else if (proSrv.timeContrast(data.promotion.dayspan.beginTime, data.promotion.dayspan.endTime)) {
                alert('活动结束时间早于开始时间，请检查');
              } else {
                $scope.isPosting = true;
                $http.post("/home/brand/" + brandId + "/promotion/" + $location.search().id, data).success(function(res) {
                  alert("提交成功");
                  $location.path("/promotion");
                }).error(function(error) {
                  $scope.isPosting = false;
                })
              }
            }
          });
        })

        $scope.selGoodsSub = function(obj) {
          obj.sel = !obj.sel;
        }
        $scope.selAllGoodsSub = function() {
          $scope.batch = $scope.chkAllBtn;
          res.data.goodsSubGroups.forEach(function(io) {
            io.sel = $scope.chkAllBtn;
          })
        }

        $scope.selGoodsGroupFn = function(obj) {
          res.data.goodsGroups.forEach(function(io) {
            io.sel = false;
          })
          obj.sel = true;
          Group = obj.id;
          res.data.goodsSubGroups.forEach(function(io) {
            io.show = false;
            //console.log(io)
            //console.log(obj)
            if (io.group == obj.id) {
              io.show = true;
            }
          })
          $(".groupAll").removeClass("bg-success");
        }

        $scope.groupAllFn = function() {
            $(".groupAll").addClass("bg-success");
            Group = true;
            res.data.goodsGroups.forEach(function(io) {
              io.sel = false;
            })
            res.data.goodsSubGroups.forEach(function(indexSubGroup) {
              indexSubGroup.show = true;
            })
          }
          //console.log(res)
        $scope.promotionData = res;
        if ($scope.promotionData.promotion._serviceHour == null) {
          $scope.selServicehour = 0;
        } else {
          $scope.selServicehour = $scope.promotionData.promotion._serviceHour.id;
        }

        $scope.batchFn = function() {
          $scope.promotionData.data.goodsSubGroups.forEach(function(io) {
            if (io.show && io.sel) {
              io.percentage = $scope.batchData;
              io.sel = false;
            }
          });
        }

        $scope.batchDataChange = function() {
          if ($scope.batchData > 100) {
            $scope.batchData = 100;
          };
          if ($scope.batchData < 0) {
            $scope.batchData = 0;
          }
        }

        $scope.percentageChange = function(obj) {
          if (obj.percentage > 100) {
            obj.percentage = 100;
          }
          if (obj.percentage < 0) {
            obj.percentage = 0;
          }
        }
        $scope.selGoodsSub = function(obj) {
          obj.sel = !obj.sel;
          var selNum = 0;
          $scope.promotionData.data.goodsSubGroups.forEach(function(io) {
            if (io.sel) {
              selNum++;
            }
          })
          if (selNum > 0) {
            $scope.batch = true;
          } else {
            $scope.batch = false;
          }
        }


      })


    }
  ])
})
