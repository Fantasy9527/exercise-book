define(["angular", "uiRouter", "angularFileUpload"], function () {
  /*设置新增行自动获取焦点的指令*/
  var app = angular.module('sanyiapp', ['ui.router', "angularFileUpload"]);
  app.directive('setFocus', function () {
    return function (scope, element) {
      element[0].focus();
    }
  });

  /*配置页面局部刷新时展示的html文件*/
  app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');
    $stateProvider
      .state('/list', {
        url: '/list',
        templateUrl: '/assets/templates/memberapp/typeList.html',
        controller: 'listController'
      })
      .state('/detail', {
        url: '/detail/:id',
        templateUrl: '/assets/templates/memberapp/typeDetail.html',
        controller: 'detailController'
      })
      .state('/typeMoneyChange', {
        url: '/typeMoneyChange/:id',
        templateUrl: '/assets/templates/memberapp/typeMoneyChange.html',
        controller: 'typeMoneyChangeController'
      })
  });


  app.controller('typeMoneyChangeController', ['$scope', '$http', '$stateParams', '$location', function ($scope, $http, $stateParams, $location) {
    console.log($stateParams.id)
    $scope.goDetailPage = function () {
      var href = '/home/brand/' + brandId + '/member/type#/detail/' + $stateParams.id;
      window.location.href = href;
    }
    var params;
    //console.log($location.search())
    if ($location.search().hasOwnProperty('page')) {
      params = $location.search();
    } else {
      params = {
        page: 0,
        pageSize: 20
      }
    }
    getData();

    function getData() {
      $http.get("/home/brand/" + brandId + "/member/type/" + $stateParams.id + "/stat/balance", {
        params: params
      }).success(function (res) {
        $location.search(params);
        $scope.model = res.balanceChanges;
        for (var i = 0; i < res.pages.showing.length; i++) {
          if (res.pages.showing[i] == null) {
            res.pages.showing[i] = {
              name: "..."
            }
          } else {
            res.pages.showing[i] = {
              name: res.pages.showing[i] + 1
            }
          }
        }
        $scope.pageModel = res.pages;
        $scope.pageShowing = res.pages.showing;
      })
    }

	$scope.formatMoney = function(money){
      return formatMoney(money)
    }

    //下一页
    $scope.pageNext = function (num) {
      params.page = num;
      getData();
    };

    //上一页
    $scope.pagePrevious = function (num) {
        params.page = num;
        getData();
      }
      //跳到当前页面
    $scope.indexPage = function (num) {
      if (num != "...") {
        params.page = num - 1;
        getData();
      }
    }

}])


  app.controller('listController', function ($scope, $http, $document) {

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
      var href = '#/detail/' + model.id;
      window.location.href = href;
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



  app.controller('detailController', function ($scope, $http, $stateParams, $timeout, $rootScope, FileUploader) {

    var allProvinces, allCities, allShops

    $rootScope.reback = function () {
      var href = '/home/brand/' + brandId + '/member/type';
      window.location.href = href;
    }

    $rootScope.goChangePage = function () {
      var href = '/home/brand/' + brandId + '/member/type#/typeMoneyChange/' + $stateParams.id;
      window.location.href = href;
    }

    $scope.model = {};
    $scope.displayEditArea1 = -1;
    $scope.displayEditArea2 = -1;
    $scope.displayEditArea3 = -1;
    $scope.displayEditArea4 = -1;

    $scope.showingProvinces = []
    $scope.showingCities = []
    $scope.showingShops = []


    function packageProvinces() {
      $scope.showingProvinces.push({
        id: -1,
        name: "全部"
      })
      $scope.provinces.forEach(function (province) {
        var model = {}
        model.id = province.id
        model.name = province.name
        $scope.showingProvinces.push(model)
      })
    }

    function packageCities() {
      $scope.showingCities.push({
        id: -1,
        province: -1,
        name: "全部"
      })
      $scope.provinces.forEach(function (province) {
        $scope.showingCities.push({
          id: -1,
          province: province.id,
          name: "全部"
        })
        province.cities.forEach(function (city) {
          var model = {}
          model.province = province.id
          model.id = city.id
          model.name = city.name
          $scope.showingCities.push(model)
        })
      })
    }

    function packageShops() {
      $scope.provinces.forEach(function (province) {
        province.cities.forEach(function (city) {
          city.shops.forEach(function (shop) {
            var model = {}
            model.province_id = province.id
            model.province_name = province.name
            model.city_id = city.id
            model.city_name = city.name
            model.shop_id = shop.id
            model.shop_name = shop.name
            model.isSelected = false
            $scope.shopHasMemberTypes.forEach(function (shm) {
              if (shm.shop == shop.id) {
                model.isSelected = true
                return
              }
            })
            $scope.showingShops.push(model)
          })
        })
      })
    }

    $scope.selectProvince = function (province) {
      $scope.showingCities = []
      $scope.showingShops = []
      $scope.selectedCity = -1
      $scope.currentPage = 1
      if (province == -1) {
        $scope.showingCities.push({
          id: -1,
          province: -1,
          name: "全部"
        })
        $scope.showingShops = JSON.parse(JSON.stringify(allShops))
      } else {
        allCities.forEach(function (city) {
          if (city.province == province) {
            $scope.showingCities.push(city)
          }
        })
        allShops.forEach(function (shop) {
          if (shop.province_id == province) {
            $scope.showingShops.push(shop)
          }
        })
      }
      getRecordCount()
      sliceShops()
      $scope.isSelectAll = checkIsSelectAll()
    }

    function getRecordCount() {
      if ($scope.displayEditArea2 == 1) {
        $scope.recordCount = $scope.showingShops.length
      } else {
        var count = 0
        $scope.showingShops.forEach(function (shop) {
          if (shop.isSelected == true) {
            count += 1
          }
        })
        $scope.recordCount = count
      }
    }

    $scope.selectCity = function (city) {
      $scope.currentPage = 1
      $scope.showingShops = []
      allShops.forEach(function (shop) {
        if (city == -1) {
          if (shop.province_id == $scope.selectedProvince) {
            $scope.showingShops.push(shop)
          }
        } else {
          if (shop.city_id == city) {
            $scope.showingShops.push(shop)
          }
        }
      })
      getRecordCount()
      sliceShops()
      $scope.isSelectAll = checkIsSelectAll()
    }

    $scope.selectAllShop = function () {
      $scope.showingShops.forEach(function (shop) {
        shop.isSelected = $scope.isSelectAll
      })
      saveStatusToAllShops()
    }

    $scope.selectShop = function (id) {
      $scope.isSelectAll = checkIsSelectAll()
      saveStatusToAllShops()

    }

    function checkIsSelectAll() {
      var allShopHasSelected = true
      $scope.showingShops.forEach(function (shop) {
        if (shop.isSelected == false) {
          allShopHasSelected = false
          return
        }
      })
      return allShopHasSelected
    }

    function saveStatusToAllShops() {
      allShops.forEach(function (shop) {
        $scope.showingShops.forEach(function (s) {
          if (shop.shop_id == s.shop_id) {
            shop.isSelected = s.isSelected
            return
          }
        })
      })
    }

    var getMemberTypeDetailUrl = '/home/brand/' + brandId + '/member/type/' + $stateParams.id;
    $http.get(getMemberTypeDetailUrl).success(function (data) {
      $scope.model = data.model
      if ($scope.model.is_weixin == false) {
        $scope.conFirmWeixin();
      }
      $scope.tempModel = JSON.parse(JSON.stringify($scope.model)) //备份数据，隐藏编辑框时还原状态
      $scope.provinces = data.shops
      $scope.pointChangeType = data.pointChangeType
      $scope.packPointChangeType()
      $scope.model.validity = $scope.millsecondSwitch($scope.model.validity)
      $scope.model.debit_validity = $scope.millsecondSwitch($scope.model.debit_validity)
      $scope.shopHasMemberTypes = data.shopHasMemberTypes
      $scope.memberTypeWithShops = []
      packageShops()
      allShops = JSON.parse(JSON.stringify($scope.showingShops))
      $scope.tempAllShops = JSON.parse(JSON.stringify(allShops)) //备份数据，隐藏编辑框时还原状态
      packageCities()
      allCities = JSON.parse(JSON.stringify($scope.showingCities))
      packageProvinces()
      allProvinces = JSON.parse(JSON.stringify($scope.showingProvinces))
      $scope.selectedProvince = -1
      $scope.selectProvince($scope.selectedProvince)
      $scope.isSelectAll = checkIsSelectAll()
      getRecordCount()
      sliceShops()
    })

    /*分页*/
    $scope.pageSize = 5;
    /*设置一个对象，方便子作用域操作*/
    $scope.shareObject = {}
      /*当前选择的分页*/
    $scope.shareObject.currentPage = 1;
    $scope.currentPage = 1;

    function sliceShops() {
      var showingSelectedShops = []
      $scope.currentPageShops = $scope.showingShops.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize)
      $scope.showingShops.forEach(function (shop) {
        if (shop.isSelected == true) {
          showingSelectedShops.push(shop)
        }
      })
      $scope.currentPageSelectedShops = showingSelectedShops.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize)
    }

    $scope.searchMembers = function () {
      $scope.currentPage = $scope.shareObject.currentPage
      sliceShops()
    }

    /*确认该品牌是否已添加微信会员*/
    $scope.conFirmWeixin = function () {
      var confirmUrl = '/home/brand/' + brandId + '/member/type/check/weixin';
      $http.get(confirmUrl).success(function (data) {
        $scope.hasWeixin = data.result;
      })
    }

    /*展开编辑框1*/
    $scope.editArea1 = function () {
      $scope.displayEditArea1 = 1;
      $scope.displayEditArea2 = -1;
      $scope.displayEditArea3 = -1;
      $scope.displayEditArea4 = -1;
    }

    /*展开编辑框2*/
    $scope.editArea2 = function () {
      $scope.displayEditArea1 = -1;
      $scope.displayEditArea2 = 1;
      $scope.displayEditArea3 = -1;
      $scope.displayEditArea4 = -1;
      $scope.recordCount2 = 1;
      $scope.selectProvince($scope.selectedProvince);
    }

    /*展开编辑框3*/

    $scope.editArea3 = function () {
      $scope.displayEditArea1 = -1;
      $scope.displayEditArea2 = -1;
      $scope.displayEditArea3 = 1;
      $scope.displayEditArea4 = -1;
    }

    /*展开编辑框4*/
    $scope.editArea4 = function () {
      $scope.displayEditArea1 = -1;
      $scope.displayEditArea2 = -1;
      $scope.displayEditArea3 = -1;
      $scope.displayEditArea4 = 1;
    }

    /*关闭编辑框*/
    $scope.hideEditArea = function (val) {
      $scope.model = JSON.parse(JSON.stringify($scope.tempModel))
      if (val == 1) {
        $scope.displayEditArea1 = -1
      } else if (val == 2) {
        $scope.currentPage = 1
        allShops = JSON.parse(JSON.stringify($scope.tempAllShops))
        $scope.selectProvince(-1)
        $scope.displayEditArea2 = -1
      } else if (val == 3) {
        $scope.displayEditArea3 = -1
      } else if (val == 4) {
        $scope.displayEditArea4 = -1
      }
    }

    $scope.showEditAlert = -1

    /*保存编辑框中的数据*/

    $scope.saveModel = function () {
      $scope.postModel = angular.copy($scope.model);
      $scope.postModel.validity = $scope.timeSwitch($scope.postModel.validity);
      $scope.postModel.debit_validity = $scope.timeSwitch($scope.postModel.debit_validity);
      $scope.postModel.point_change_type = $scope.postModel.point_change_type.id;
      $scope.postModel.shops = [];
      allShops.forEach(function (s) {
        if (s.isSelected == true) {
          $scope.postModel.shops.push(s.shop_id);
        }
      })
      if ($scope.postModel.is_debit == false) {
        $scope.postModel.debit_credit = 0;
        $scope.postModel.debit_validity = 0;
      }
      var checkDupNameUrl = '/home/brand/' + brandId + '/member/type/check/name';
      var checkModel = {};
      checkModel.name = $scope.postModel.name;
      $http.post(checkDupNameUrl, checkModel).success(function (data) {
        var result = data.result;
        if (result.length > 0 && result.pop().id != $stateParams.id) {
          alert("已存在同名会员类型!")
          return;
        } else {
          var saveMemberTypeUrl = '/home/brand/' + brandId + '/member/type/' + $stateParams.id;
          $http.post(saveMemberTypeUrl, $scope.postModel).success(function (data) {
            $scope.currentPage = 1
            $scope.selectProvince(-1)
            $scope.displayEditArea1 = -1;
            $scope.displayEditArea2 = -1;
            getRecordCount()
            $scope.displayEditArea3 = -1;
            $scope.displayEditArea4 = -1;
            $scope.showEditAlert = 1;
            $timeout(function () {
              $scope.showEditAlert = -1;
            }, 5000)
          })
        }
      })
    }

    $scope.showWaringArea = -1;
    /*校验用户名是否已存在*/
    $scope.checkDupName = function (val) {
      if (val != undefined && val.length > 0) {
        var checkDupNameUrl = '/home/brand/' + brandId + '/member/type/check/name';
        var postModel = {};
        postModel.name = val;
        $http.post(checkDupNameUrl, postModel).success(function (data) {
          var result = data.result;
          if (result.length > 0 && result.pop().id != $stateParams.id) {
            $scope.showWaringArea = 1;
          }
        })
      }
    }

    $scope.hideWarningArea = function () {
      $scope.showWaringArea = -1;
    }

    /*将积分规则绑定到model中*/
    $scope.packPointChangeType = function () {
      $scope.pointChangeType.forEach(function (type) {
        if (type.id == $scope.model.point_change_type) {
          $scope.model.point_change_type = type;
        }
      })
    }

    /*将时间段转换为天数*/
    $scope.timeSwitch = function (time) {
      var mils = 0;
      switch (time) {
      case "100年":
        mils = 36500;
        break;
      case "10年":
        mils = 3650;
        break;
      case "5年":
        mils = 1825;
        break;
      case "2年":
        mils = 730;
        break;
      case "1年":
        mils = 365;
        break;
      case "6个月":
        mils = 180;
        break;
      case "3个月":
        mils = 90;
        break;
      case "1个月":
        mils = 30;
        break;
      default:
        mils = "";
      }
      return mils;
    }

    /*将天数转换为时间段*/
    $scope.millsecondSwitch = function (mils) {
      var time = "";
      switch (mils) {
      case 36500:
        time = "100年";
        break;
      case 3650:
        time = "10年";
        break;
      case 1825:
        time = "5年";
        break;
      case 730:
        time = "2年";
        break;
      case 365:
        time = "1年";
        break;
      case 180:
        time = "6个月";
        break;
      case 90:
        time = "3个月";
        break;
      case 30:
        time = "1个月";
        break;
      default:
        time = "";
      }
      return time;
    }


    /*选中是否添加微信会员单选框*/
    $scope.choseWeixin = function () {
      /*选中单选框时弹出提示信息*/
      if ($scope.model.is_weixin == true && $scope.hasWeixin == true) {
        var confirmWeixin = confirm("品牌已添加微信会员类型，是否确认更改微信会员类型？");
        if (confirmWeixin == false) {
          $scope.model.is_weixin = false;
        }
      }
    }


    //上传图片
    var uploader = $scope.uploader = new FileUploader({
      url: '/home/brand/' + brandId + '/upload',
      autoUpload: true
    });


    uploader.filters.push({
      name: 'customFilter',
      fn: function (item, options) {
        return this.queue.length < 10;
      }
    });
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);

      //console.log(response.url)
      $scope.model.image = response.sha;
      $scope.model.image_url = response.url;
    };

    /*  uploader.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };

        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };*/



  })
})
