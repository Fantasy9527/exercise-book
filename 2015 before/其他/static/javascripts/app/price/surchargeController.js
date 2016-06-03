define(["priceApp"], function(app) {
  app.controller("surchargeController", ["$scope", "$http", "$location", "$state", function($scope, $http, $location, $state) {
    $http.get("/home/brand/" + brandId + "/price/" + priceId + "/surcharges").success(function(res) {
      //console.log(res);
      res.models.forEach(function(o) {
          res.surcharges.forEach(function(surcharge) {
            if (o.id == surcharge.tableType) {
              o.cap = surcharge.cap;
              o.surchargeType = surcharge.surchargeType;
              o.surchargeId = surcharge.id;
              o.surchargeState = surcharge.state;
              res.percentages.forEach(function(percentage) {
                if (o.surchargeId == percentage.surcharge) {
                  o.isBeforeDiscount = percentage.isBeforeDiscount;
                  o.percentage = percentage.percentage;
                  o.percentageId = percentage.id;
                }
              })

              res.amounts.forEach(function(amount) {
                if (o.surchargeId == amount.surcharge) {
                  o.fixedValue = amount.value
                }
              })

              res.times.forEach(function(time) {
                if (o.surchargeId == time.surcharge) {
                  o.initialCharge = time.initialCharge;
                  o.initialTime = time.initialTime;
                  o.segment = time.segment;
                  o.segmentValue = time.segmentValue;
                }
              })

              res.surchargeTypes.forEach(function(surchargeType) {
                if (o.surchargeType == surchargeType.id) {
                  o.surchargeTypeName = surchargeType.name;
                }
              })
            }
          })

          res.states.forEach(function(state) {
            if (o.surchargeState == state.id) {
              //console.log(state.name)
              o.stateName = state.name;
            }
          })
          o.isDel = false;
        })
        //console.log(res.models)
      $scope.models = res.models;
      $scope.states = res.states;
      $scope.surchargeTypes = res.surchargeTypes;
    })

    $scope.surchargeTypeChange = function(obj) {
      if (obj.surchargeType == 1 && typeof o.isBeforeDiscount != "boolean") {
        obj.isBeforeDiscount = true;
      }
    }


    $scope.edit = function(o) {
      $scope.models.forEach(function(model) {
        model.isEdit = false;
      })
      if (!o.hasOwnProperty("surchargeType")) {
        o.surchargeType = 1;
      }
      $scope.temp = angular.copy(o);
      o.isEdit = true;
      if (typeof o.isBeforeDiscount != "boolean") {
        o.isBeforeDiscount = true;
      }
    }

    $scope.cancel = function(o, e) {
      e.stopPropagation();
      //console.log($scope.temp);
      o.cap = $scope.temp.cap
      o.createon = $scope.temp.createon
      o.fixedValue = $scope.temp.fixedValue
      o.id = $scope.temp.id
      o.initialCharge = $scope.temp.initialCharge
      o.initialTime = $scope.temp.initialTime
      o.isBeforeDiscount = $scope.temp.isBeforeDiscount
      o.name = $scope.temp.name
      o.percentage = $scope.temp.percentage
      o.remark = $scope.temp.remark
      o.segment = $scope.temp.segment
      o.segmentValue = $scope.temp.segmentValue
      o.state = $scope.temp.state
      o.stateName = $scope.temp.stateName
      o.surchargeId = $scope.temp.surchargeId
      o.surchargeType = $scope.temp.surchargeType
      o.surchargeTypeName = $scope.temp.surchargeTypeName
      o.isEdit = false;
    }

    $scope.deleteData = function(o, e) {
      e.stopPropagation();
      $http.delete("/home/brand/" + brandId + "/price/" + priceId + "/surcharge/" + o.surchargeId).success(function(res) {
        delete o.cap;
        delete o.surchargeTypeName;
        delete o.stateName;
        o.isEdit = false;
        o.isDel = true;
      }).error(function(res) {
        alert(res.message)
      })
    }

    $scope.saveData = function(obj, e) {
      e.stopPropagation();
      var json = {};
      json._surcharge = {
        surchargeType: obj.surchargeType,
        tableType: obj.id,
        pricePlan: priceId,
        cap: obj.cap,
        state: 1
      }
      var isPass = false;
      if (obj.surchargeType == 1) {
        json._bypercentage = {
          percentage: obj.percentage,
          isBeforeDiscount: obj.isBeforeDiscount
        }
        isPass = true;
        obj.percentage == undefined && (alert("收费比率没有填"), isPass = false);
        obj.cap == undefined && (alert("服务费封顶没有填"), isPass = false);
      }

      if (obj.surchargeType == 2) {
        json._byamount = {
          value: obj.fixedValue
        }
        json._surcharge.cap = obj.fixedValue;
        isPass = true;
        obj.fixedValue == undefined && (alert("固定额度没有填"), isPass = false);

        json._surcharge.cap == undefined && (alert("服务费封顶没有填"), isPass = false);

      }

      if (obj.surchargeType == 3) {
        json._bytime = {
          initialCharge: obj.initialCharge,
          initialTime: obj.initialTime,
          segment: obj.segment,
          segmentValue: obj.segmentValue
        }
        isPass = true;
        obj.initialCharge == undefined && (alert("起步收费没有填"), isPass = false);
        obj.initialTime == undefined && (alert("起步时长没有填"), isPass = false);
        obj.segment == undefined && (alert("时长单位没有填"), isPass = false);
        obj.segmentValue == undefined && (alert("时长收费没有填"), isPass = false);
        obj.cap == undefined && (alert("服务费封顶没有填"), isPass = false);
      }
      //alert(isPass)
      console.log(json)
      if (!isPass) {
        return
      };
      $http.post("/home/brand/" + brandId + "/price/" + priceId + "/surcharge", json).success(function(res) {
        obj.isEdit = false;
        obj.isDel = false;
        obj.surchargeState = 1;
        obj.surchargeId = res.surcharge.id;
        if (res.bypercentage) {
          obj.percentageId = res.bypercentage.id;
        }

        $scope.surchargeTypes.forEach(function(surchargeType) {
          if (obj.surchargeType == surchargeType.id) {
            obj.surchargeTypeName = surchargeType.name;
          }
        })
      }).error(function(res) {
        alert(res.message)
      })
    }

    $scope.exception = function(o, e) {
      e.stopPropagation();
      $state.go("exception", {
        surcharge: o.surchargeId,
        percentage: o.percentageId
      })
    }
  }])




})
