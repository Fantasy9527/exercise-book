define(["angular", "uiRouter"], function () {
  var app = angular.module('sanyiapp', ['ui.router'])

  app.run(["$rootScope", function ($rootScope) {
    $rootScope.brandId = brandId
    $rootScope.goodsTypeId = goodsTypeId
  }])
  app.controller("applyShopController", ["$scope", "$http", "$location", "$timeout", "$document", function ($scope, $http, $location, $timeout, $document) {

    $scope.superParams = $location.search()

    setTimeout(function () {
      $('.datepickerTime').datetimepicker()
    }, 300)
    $scope.showShopState = 1
    $scope.states = [{"id": 1, "name": "正在销售门店", "selected": false},{"id": 0, "name": "未销售门店", "selected": false}]
    $scope.indexTab = "中国"
    $scope.isMenuOpen = false

    function getModels(province, city){
      var params = {province: province, city: city}
      var url = "/home/brand/" + brandId + "/goodsType/" + goodsTypeId + "/apply/shop"
      $http.get(url, {params: params}).success(function (data) {
        $scope.goodsTypeName = data.goodsType.name
        $scope.isLoding = false
        var models = data.shops
        $scope.serviceHours = data.serviceHours
        packageServiceHours()
        addModel.serviceHour = data.serviceHours[0].id
        models.forEach(function (model) {
          model.hasApply = false
          model.serviceHour = $scope.serviceHours[0].id
          model.serviceHourName = $scope.serviceHours[0].name
          model.monday = true
          model.tuesday = true
          model.wednesday = true
          model.thursday = true
          model.friday = true
          model.saturday = true
          model.sunday = true
          model.beginTime = getTime()
          model.goodses.forEach(function (goods) {
            if (goods.product != undefined){
              model.hasApply = true
              goods.price = goods.product.price
              goods.newPrice = goods.price
              model.beginTime = goods.product.beginTime
              model.monday = goods.product.monday
              model.tuesday = goods.product.tuesday
              model.wednesday = goods.product.wednesday
              model.thursday = goods.product.thursday
              model.friday = goods.product.friday
              model.saturday = goods.product.saturday
              model.sunday = goods.product.sunday
              $scope.serviceHours.forEach(function (serviceHour) {
                if (serviceHour.id == goods.product.serviceHour) {
                  model.serviceHour = serviceHour.id
                  model.serviceHourName = serviceHour.name
                  return
                }
              })
              return
            }
          })
        })
        $scope.sourceModels = models
        $scope.models = angular.copy($scope.sourceModels)
        addIndex($scope.models)
        if($scope.showShopState == undefined){
          $scope.showShopState = 1
        }
        $scope.tab($scope.showShopState,false)
      })
    }
    getModels()

    function packageServiceHours(){
      var model = {"id": -1, "name": "全部市别"}
      $scope.serviceHours.unshift(model)
    }

    $http.get("/home/brand/" + brandId + "/area/country/1/shops").success(function (areaData) {
      $scope.countryData = areaData
    })

    $scope.stopPropagation = function(event){
      event.stopPropagation()
    }

    /**
     * 选择国家
     */
    $scope.selCountry = function(){
      $scope.indexTab = "中国"
      getModels()
      $scope.countryData.forEach(function(province){
        province.selected = false
      })
      $scope.cities.forEach(function(city){
        city.selected = false
      })
    }

    /*选择省*/
    $scope.selProvince = function(province){
      $scope.countryData.forEach(function(province){
        province.selected = false
      })
      $scope.cities = province.cities
      $scope.indexTab = province.name
      province.selected = true
      getModels(province.id)
      $scope.cities.forEach(function(city){
        city.selected = false
      })
    }

    /*选择城市*/
    $scope.selCity = function(city){
      $scope.cities.forEach(function(city){
        city.selected = false
      })
      $scope.indexTab = city.name
      city.selected = true
      getModels(city.province, city.id)
    }

    /*添加序号*/
    function addIndex(models){
      var a = 0; var b = 0
      models.forEach(function(model){
        if(model.hasApply){
          a = a + 1
          model.index = a
        } else {
          b = b + 1
          model.index = b
        }
      })
    }

    /*切换状态*/
    $scope.tab = function(id,allSelected){
      $scope.states.forEach(function(x){
        x.selected = false
        if(x.id == id){
          x.selected = true
        }
      })
      $scope.showShopState = id
      $scope.judgeAllSelected(allSelected)
    }

    /*关闭编辑框*/
    $scope.closeEdit = function(){
      $scope.models = angular.copy($scope.sourceModels)
      addIndex($scope.models)
    }

    /*打开编辑框*/
    $scope.openEdit = function(m){
      if(m.isEdit){
        return
      } else {
        $scope.closeEdit()
        $scope.models.forEach(function(model){
          model.isEdit = false
          if(model.shop == m.shop){
            model.isEdit = true
          }
        })
        setTimeout(function () {
          $('.datepickerTime').datetimepicker()
        }, 300)
      }
    }

    /*保存编辑结果*/
    $scope.saveData = function(e, model){
      var postModel = angular.copy(model)
      postModel.shops = [model.shop]
      postModel.goodses.forEach(function(goods){
        if(goods.newPrice == ''){
          delete goods.newPrice
        }
      })
      if(postModel.serviceHour == -1){
        delete postModel.serviceHour
      }
      var url = '/home/brand/' + brandId + '/goodsType/' + goodsTypeId + '/apply/shop'
      $http.post(url, postModel).success(function(data){
        for(var i=0; i<$scope.sourceModels.length;i++){
          if($scope.sourceModels[i].shop == model.shop){
            model.goodses.forEach(function(g){
              g.price = g.newPrice
            })
            $scope.serviceHours.forEach(function (serviceHour) {
              if(model.serviceHour == serviceHour.id){
                model.serviceHourName = serviceHour.name
                return
              }
            })
            $scope.sourceModels[i] = model
            $scope.sourceModels[i].hasApply = true
            $scope.sourceModels[i].isEdit = false
            break
          }
        }
        $scope.closeEdit()
        openNextEdit(model.shop)
      })
    }

    /**
     * 打开下一个编辑栏
     * @param shop
     */
    function openNextEdit(shop){
      var index = 0
      for(var i=0; i<$scope.models.length; i++){
        if($scope.models[i].shop == shop){
          index = i + 1
          break
        }
      }
      while(index < $scope.models.length){
        if($scope.models[index].hasApply != $scope.showShopState){
          index ++
        } else {
          $scope.models[index].isEdit = true
          var doms = document.getElementsByName("newPrice2")
          var i = $scope.models[i].goodses.length * index
          $timeout(function(){
            doms[i].focus()
            $scope.$apply()
          }, 100)
          return
        }
      }
    }

    /*取消编辑*/
    $scope.cancelEdit = function(e,m){
      e.stopPropagation()
      m.isEdit = false
      $scope.closeEdit()
    }

    function recoverModel(model){
      model.hasApply = false
      model.isEdit = false
      model.beginTime = getTime()
      model.serviceHour = $scope.serviceHours[0].id
      model.serviceHourName = $scope.serviceHours[0].name
      model.monday = true
      model.tuesday = true
      model.wednesday = true
      model.thursday = true
      model.friday = true
      model.goodses.forEach(function(goods){
        delete goods.price
        delete goods.newPrice
        delete goods.product
      })
    }

    /*删除记录*/
    $scope.deleteData = function(shop){
      var url = '/home/brand/' + brandId + '/goodsType/' + goodsTypeId + '/apply/shop/' + shop
      $http.delete(url).success(function(data){
        $scope.sourceModels.forEach(function(model){
          if(model.shop == shop){
            recoverModel(model)
          }
        })
        $scope.models.forEach(function(model){
          if(model.shop == shop){
            recoverModel(model)
          }
        })
        addIndex($scope.sourceModels)
        addIndex($scope.models)
      })
    }

    /**
     * 获取当天日期
     * @returns {string}
     */
    function getTime(){
      var d = new Date()
      var year = d.getFullYear()
      var month = d.getMonth()
      if(month < 10){
        month = "0" + ++month
      }else {
        if(month == 12){
          month = "01"
        }else {
          month = ++month
        }
      }
      var day = d.getDate()
      if(day < 10){
        day = "0" + day
      }
      return year + "-" + month + "-" + day
    }

    var addModel = {
      "newPrice": undefined,
      "serviceHour": -1,
      "monday": true,
      "tuesday": true,
      "wednesday": true,
      "thursday": true,
      "friday": true,
      "saturday": true,
      "sunday": true,
      "beginTime": getTime()
    }

    /*选择所有的门店*/
    $scope.selectAllShop = function(allSelected){
      $scope.models.forEach(function(model){
        if(model.hasApply == $scope.showShopState){
          model.selected = allSelected
        }
      })
      $scope.sourceModels.forEach(function(model){
        if(model.hasApply == $scope.showShopState){
          model.selected = allSelected
        }
      })
      $scope.batchAddShow = allSelected
      $scope.showAddBatch()
    }

    $scope.judgeAllSelected = function(allSelected){
      allSelected = true
      var selectSize = 0
      $scope.models.forEach(function(model){
        if(model.hasApply == $scope.showShopState){
          if(!model.selected){
            allSelected = false
            return
          } else {
            selectSize ++
          }
        }
      })
      if(selectSize == 0){
        allSelected= false
      }
    }

    /*展开批量设置栏*/
    $scope.showAddBatch = function(){
      $scope.batchAddShow = false
      $scope.sourceModels.forEach(function(model){
        if(model.selected && model.hasApply == $scope.showShopState){
          $scope.batchAddShow = true
          $scope.addModel = addModel
          return
        }
      })
    }

    /*选择某个门店*/
    $scope.selectShop = function(event, model){
      event.stopPropagation()
      model.selected = !model.selected
      $scope.sourceModels.forEach(function(m){
        if(m.shop == model.shop){
          m.selected = model.selected
          return
        }
      })
      $scope.judgeAllSelected()
      $scope.showAddBatch()
    }

    function copyModel(models){
      for(var i=0; i< models.length; i++){
        if(models[i].hasApply == $scope.showShopState && models[i].selected){
          var shop = models[i].shop
          var goodses = models[i].goodses
          var serviceHourName = models[i].serviceHourName
          var name = models[i].name
          var index = models[i].index
          models[i] = angular.copy($scope.addModel)
          models[i].shop = shop
          models[i].name = name
          models[i].index = index
          models[i].serviceHourName = serviceHourName
          models[i].goodses = goodses
          models[i].goodses.forEach(function(goods){
            goods.price = $scope.addModel.newPrice
            goods.newPrice = goods.price
            goods.selfService = $scope.addModel.selfService
          })
          if($scope.addModel.newPrice == undefined){
            models[i].hasApply = false
          } else {
            models[i].hasApply = true
          }
        }
      }
    }

    /*批量保存门店定价*/
    $scope.batchSave = function(){
      var url = "/home/brand/" + brandId + "/goodsType/" + goodsTypeId + "/apply/shop/batch"
      if($scope.addModel.newPrice == undefined || $scope.addModel.newPrice.length == 0){
        delete $scope.addModel.newPrice
      }
      if($scope.addModel.newPrice == undefined){
        if(!confirm("新价格为空时,将删除此菜品在门店的定价方案, 确认删除吗?")) return
      }
      var postModel = angular.copy($scope.addModel)
      postModel.shops = []
      postModel.goodses = []
      if(postModel.serviceHour == -1){
        delete postModel.serviceHour
      }
      $scope.models.forEach(function(model){
        if(model.hasApply == $scope.showShopState && model.selected){
          postModel.shops.push(model.shop)
        }
      })
      $http.post(url, postModel).success(function(data){
        $scope.allSelected = false
        $scope.batchAddShow = false
        copyModel($scope.sourceModels)
        copyModel($scope.models)
      })
    }

    $scope.openMenu = function(e){
      e.stopPropagation()
      $scope.isMenuOpen = !$scope.isMenuOpen
    }

    /**
     * 监听键盘事件响应
     * @param event
     * @param model
     */
    $scope.keyDown = function(event, model){
      if(event.keyCode == 13 && model.isEdit){
        $scope.saveData(event, model)
      }
    }
    $document[0].onclick = function(event){
      $scope.isMenuOpen = false
      $scope.$apply()
    }
  }])
})
