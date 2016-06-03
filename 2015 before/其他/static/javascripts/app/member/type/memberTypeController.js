define(["memberApp", "tool","directive.page"],function(app){
  /*会员充值记录controller*/
  app.controller('memberTypeController', function ($scope, $http, $document,$state) {

    $scope.stopPropagation = function ($event) {
      if ($event.stopPropagation)
        $event.stopPropagation();
      else
        $event.cancelBubble = true;
    }

    $document.bind("click", function () {
      $scope.showCityArea = -1;
      $scope.$apply();
    })

    $scope.models = [];
    var tempModels = [];
    $scope.addingModel = {};
    $scope.addingTr = -1;
    $scope.page = 1;
    $scope.pageSize = 20;
    $scope.country = [];
    $scope.selectedAreaName = "中国";
    $scope.selectAreaType = 0;
    $scope.showOrHideChoseArea = function () {
      if ($scope.showCityArea == 1) {
        $scope.showCityArea = -1;
      } else {
        $scope.showCityArea = 1;
      }

    }
    $scope.highLightArea = function (province, city, shop) {

    }

    $scope.selectArea = function (country, province, city, shop) {
      $scope.selectedCountry = country
      $scope.selectedProvince = province
      $scope.selectedCity = city
      $scope.selectedShop = shop
      $scope.selectAreaType = 0
      $scope.selectedAreaName = "中国"
      $scope.focusProvince = -1
      $scope.focusCity = -1
      $scope.focusShop = -1
      if (province != undefined) {
        $scope.focusProvince = province
        $scope.selectAreaType = 1
        $scope.selectedAreaName = province.name
      } else {
        $scope.focusProvince = -1
        $scope.showCityArea = -1
      }
      if (city != undefined) {
        $scope.focusCity = city
        $scope.selectAreaType = 2
        $scope.selectedAreaName = city.name
      }
      if (shop != undefined) {
        $scope.focusShop = shop
        $scope.selectAreaType = 3
        $scope.selectedAreaName = shop.name
        $scope.showCityArea = -1
      }
      $scope.filterModel()
    }

    /////////
    $scope.skipToMember = function () {
      var href = '/home/brand/' + brandId + '/member/data';
      window.location.href = href;
    }

    /*适用范围*/
    $scope.applyScopes = [{
      "id": -1,
      "name": "不限"
    }, {
      "id": 1,
      "name": "城市"
    }, {
      "id": 0,
      "name": "门店"
    }]
    $scope.currentScopeId = -1;

    /*积分方式*/
    $scope.pointChangeTypes = [{
      "id": -1,
      "name": "不限",
      "order": -1,
      "remark": "不限"
    }]
    $scope.currentPointChangeTypeId = -1;

    /*是否支持充值*/
    $scope.recharges = [{
      "id": -1,
      "name": "不限"
    }, {
      "id": 1,
      "name": "是"
    }, {
      "id": 0,
      "name": "否"
    }]
    $scope.currentRechargeId = -1;

    /*将后台获取的数据加入pointChangeTypes*/
    $scope.getPointChangeTypes = function (datas) {
      if (datas.length > 1) {
        datas.forEach(function (data) {
          $scope.pointChangeTypes.push(data);
        })
      } else {
        $scope.pointChangeTypes = [];
      }
    }

    $scope.formatMoney = function (money) {
      return formatMoney(money)
    }

    /*选择积分方式*/
    $scope.chosePointChangeType = function (val) {
      $scope.currentPointChangeTypeId = val;
      $scope.filterModel();
    }

    /*选择是否支持充值*/
    $scope.choseRecharge = function (val) {
      $scope.currentRechargeId = val;
      $scope.filterModel();
    }

    /*调用所有的筛选条件*/
    $scope.filterModel = function () {
      /*克隆tempModels*/
      $scope.models = JSON.parse(JSON.stringify($scope.tempModels));
      var models = $scope.models;

      for (var i = 0; i < models.length; i++) {
        var deleteModel = true;
        $scope.shopHasMemberTypes.forEach(function (shopHasMemberType) {
          if (shopHasMemberType.memberType == models[i].id) {
            var shop = shopHasMemberType.shop;
            $scope.country.forEach(function (province) {
              var cities = province.cities;
              cities.forEach(function (city) {
                var shops = city.shops;
                shops.forEach(function (s) {
                  if (s.id == shop) {
                    if ($scope.selectAreaType == 0) {
                      deleteModel = false;
                    }
                    if ($scope.selectAreaType == 1 && $scope.selectedProvince == province) {
                      deleteModel = false;
                    }
                    if ($scope.selectAreaType == 2 && $scope.selectedCity == city) {
                      deleteModel = false;
                    }
                    if ($scope.selectAreaType == 3 && $scope.selectedShop.id == shop) {
                      deleteModel = false;
                    }
                  }
                })
              })
            })
          }
        })
        if (deleteModel == true) {
          models.splice(i, 1);
          i--;
        }
      }

      if ($scope.currentPointChangeTypeId != -1) {
        for (var i = 0; i < models.length; i++) {
          if (models[i].point_change_type.id != $scope.currentPointChangeTypeId) {
            models.splice(i, 1);
            i--;
          }
        }
      }

      if ($scope.currentRechargeId != -1) {
        for (var i = 0; i < models.length; i++) {
          if (models[i].is_cash.id != $scope.currentRechargeId) {
            models.splice(i, 1);
            i--;
          }
        }
      }

      $scope.recordCount = models.length;
      $scope.temp = JSON.parse(JSON.stringify($scope.models));
      $scope.searchMembers();
    }

    $scope.brandId = brandId;
    /*拼接出请求后台数据的url*/
    var getAllTypesUrl = '/home/brand/' + $scope.brandId + '/member/types';
    $http.get(getAllTypesUrl).success(function (data) {
      $scope.tempModels = data.models;
      var pointChangeTypes = data.pointChangeType;
      $scope.getPointChangeTypes(pointChangeTypes);
      $scope.country = data.shops;
      $scope.shopHasMemberTypes = data.shopHasMemberTypes;
      var tempModels = $scope.tempModels;
      for (var i = 0; i < tempModels.length; i++) {
        if (tempModels[i].state == 2) {
          tempModels.splice(i, 1);
          i--;
        }
      }

      /*将数据封装为需要的样式展示到页面*/
      tempModels.forEach(function (model) {

        /*处理是否可充值*/
        var recharge = {};
        if (model.is_cash == true) {
          recharge.id = 1;
          recharge.name = "是";
        } else {
          recharge.id = 0;
          recharge.name = "否"
        }
        model.is_cash = recharge;

        /*处理积分方式*/
        $scope.pointChangeTypes.forEach(function (type) {
          if (model.point_change_type == type.id) {
            model.point_change_type = type;
          }
        })


        /*处理积分是否可抵扣现金*/
        if (model.is_debit) {
          model.is_debit = "是";
        } else {
          model.is_debit = "否";
        }
        /*处理有效期*/
        var vt = model.validity;
        switch (vt) {
        case 36500:
          model.validity = "100年";
          break;
        case 3650:
          model.validity = "10年";
          break;
        case 1825:
          model.validity = "5年";
          break;
        case 730:
          model.validity = "2年";
          break;
        case 365:
          model.validity = "1年";
          break;
        case 180:
          model.validity = "6个月";
          break;
        case 90:
          model.validity = "3个月";
          break;
        case 30:
          model.validity = "1个月";
          break;
        default:
          model.validity = "";
        }
      })
      $scope.models = JSON.parse(JSON.stringify($scope.tempModels));
      $scope.filterModel();
    });

    /*弹出新增会员卡*/
    $scope.addCard = function () {
        $scope.addingTr = 0;
      }
      /*弹出编辑框*/
    $scope.editModel = function (model) {
      $scope.addingTr = val;
    }

    /*将毫秒数转换为时间段*/
    $scope.millsecondSwitch = function (val) {
        switch (val) {
        case "100年":
          $scope.postModel.validity = 36500;
          break;
        case "10年":
          $scope.postModel.validity = 3650;
          break;
        case "5年":
          $scope.postModel.validity = 1825;
          break;
        case "2年":
          $scope.postModel.validity = 730;
          break;
        case "1年":
          $scope.postModel.validity = 365;
          break;
        case "6个月":
          $scope.postModel.validity = 180;
          break;
        case "3个月":
          $scope.postModel.validity = 90;
          break;
        case "1个月":
          $scope.postModel.validity = 30;
          break;
        default:
          $scope.postModel.validity = "";
        }
      }
      /*停止会员卡*/
    $scope.stopMemberType = function (model) {
      var confirmWeixin = confirm("停用会员类型会导致所有属于该会员类型的会员被停用，是否确认停用会员类型？");
      if (confirmWeixin == true) {
        /*拼接到后台的url*/
        var stopMemberTypeUrl = '/home/brand/' + brandId + '/member/type/pause/' + model.id;
        $scope.postModel = model;
        if ($scope.postModel.is_cash == "是") {
          $scope.postModel.is_cash = true;
        } else {
          $scope.postModel.is_cash = false;
        }
        if ($scope.postModel.is_debit == "是") {
          $scope.postModel.is_debit = true;
        } else {
          $scope.postModel.is_debit = false;
        }
        if ($scope.postModel.point_change_type == "按消费额") {
          $scope.postModel.point_change_type = 1;
        } else {
          $scope.postModel.point_change_type = 2;
        }
        $scope.millsecondSwitch($scope.postModel.validity);
        $scope.postModel.state = 2;
        $http.post(stopMemberTypeUrl, $scope.postModel).success(function (data) {
          for (var i = 0; i < $scope.models.length; i++) {
            if ($scope.models[i].id == model.id) {
              $scope.models.splice(i, 1);
            }
          }
        });
      }
    }

    $scope.reback = function () {
      var href = '/home/brand/' + brandId + '/system';
      window.location.href = href;
    }

    $scope.addMemberType = function () {
      var href = '/home/brand/' + brandId + '/member/type/add';
      window.location.href = href;
    }

    /*跳转到详细页面*/
    $scope.skipToDetail = function (model) {
        $state.go("member.type.detail",{id:model.id })
    }

    $scope.pageSize = 20;
    $scope.currentPage = 1;
    $scope.shareObject = {};
    $scope.shareObject.currentPage = 1;
    $scope.searchMembers = function () {
      $scope.currentPage = $scope.shareObject.currentPage;
      $scope.models = JSON.parse(JSON.stringify($scope.temp));
      $scope.models = $scope.models.slice($scope.pageSize * ($scope.currentPage - 1), $scope.pageSize * $scope.currentPage);
    }
  })
})
