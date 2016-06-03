define(["memberApp","directive.page"],function(app){
  app.controller('memberDetailController', function ($scope, $http, $stateParams, $timeout, $rootScope, FileUploader) {
$scope.id=$stateParams.id;
    var allProvinces, allCities, allShops
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
