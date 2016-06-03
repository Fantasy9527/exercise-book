define(["angular", "uiRouter", "popupoverlay"], function () {
  var app = angular.module('sanyiapp', ['ui.router']);
  app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('setHome').when("", "/setHome");
    $stateProvider
      .state('setHome', { //套餐列表
        url: '/setHome',
        templateUrl: '/assets/templates/set/setHome.html',
        controller: 'setHomeController'
      })
      .state('setEdit', { //套餐编辑
        url: '/setEdit?set',
        templateUrl: '/assets/templates/set/setEdit.html',
        controller: 'setEditController'
      })
      .state('setPrice', { //套餐定价
        url: '/setPrice?set',
        templateUrl: '/assets/templates/set/setPrice.html',
        controller: 'setPriceController'
      })
  })
  app.run(["$rootScope", function ($rootScope) {
    $rootScope.brandId = brandId;
  }])

  app.controller("setHomeController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    var params;
    $scope.isLoding = true;
    if ($location.search().hasOwnProperty('page')) {
      params = $location.search();
    } else {
      params = {
        pageSize: 20,
        page: 0,
        query: ""
      }
    }
    
    $scope.searchData=params.query;
    $scope.newSet = function () {
      if ($scope.childCombos.length == 0) {
        alert("套餐没有小类,请在菜品分类页面里添加套餐的小类");
        return
      }
      var json = {
        id: 0,
        name: "",
        subgroup: $scope.childCombos[0].id,
        subgroupName: $scope.childCombos[0].name,
        remark: "",
        isEdit: true,
        isNew: true
      }
      $scope.model.forEach(function (model) {
        if (model.isEdit) {
          model.name = $scope.temp.name;
          model.subgroup = $scope.temp.subgroup;
          model.subgroupName = $scope.temp.subgroupName;
          model.remark = $scope.temp.remark;
        }
        model.isEdit = false;
      })
      $scope.model.unshift(json)
    }

    $scope.editData = function (x) {
      if (x.isEdit) {
        return
      }
      $scope.model.forEach(function (model) {
        if (model.isEdit) {
          model.name = $scope.temp.name;
          model.subgroup = $scope.temp.subgroup;
          model.subgroupName = $scope.temp.subgroupName;
          model.remark = $scope.temp.remark;
        }
        model.isEdit = false;
      })
      $scope.temp = angular.copy(x);
      x.isEdit = true;
    }

    $scope.saveData = function (obj, e) {
      e.stopPropagation();
      var url = "/home/brand/" + brandId + "/set/" + obj.id + "/combos/" + obj.subgroup;
      if (obj.isNew) {
        url = "/home/brand/" + brandId + "/set/" + obj.subgroup;
      }
      $.trim(obj.name);
      if (obj.name == "") {
        alert("名字不能为空");
        return
      }
      $http.post(url, obj).success(function (res) {
        obj.isEdit = false;
        obj.isNew = false;
        obj.id = res.id;
        obj.subgroupName = (function () {
          var str = ""
          $scope.childCombos.forEach(function (io) {
            if (obj.subgroup == io.id) {
              str = io.name;
            }
          })
          return str;
        })();

      }).error(function (error) {
        alert(error.message)
      })
    }

    $scope.cancelEidit = function (model, e) {
      e.stopPropagation();
      if (model.isNew) {
        $scope.model.shift();
        return;
      }
      model.isEdit = false;
      model.name = $scope.temp.name;
      model.subgroup = $scope.temp.subgroup;
      model.subgroupName = $scope.temp.subgroupName;
      model.remark = $scope.temp.remark;
    }

    $scope.delData = function (obj, index) {
      $http.delete("/home/brand/" + brandId + "/set/" + obj.id).success(function () {
        $scope.model.splice(index, 1);
      }).error(function (error) {
        alert(error.message)
      })
    }

    $scope.search = function (e) {
      params.query = $scope.searchData
      params.page = 0
      getData()
    }

    $scope.enterSearch = function (e) {
      if (e.keyCode == 13) {
        $scope.search()
      }
    }
    
    getData()

    function getData() {
      $location.search(params)
      $http.get("/home/brand/" + brandId + "/sets", {
        params: params
      }).success(function (res) {
        $scope.isLoding = false;
        $scope.model = res.sets;
        $scope.pages = res.pages;
        $scope.groups = res.group;
        $scope.subgroups = res.subgroups;
        $scope.childCombos = res.childCombos;

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
        $scope.pageShowing = res.pages.showing;

      })
    }

    $scope.pageNext = function (num) {
      params.page = num;
      getData();
    };
    $scope.pagePrevious = function (num) {
      params.page = num;
      getData();
    }
    $scope.indexPage = function (num) {
      if (num != "...") {
        params.page = num - 1;
        getData();
      }
    }

    $scope.editSet = function (id, e) {
      e.stopPropagation();
      $location.path("/setEdit").search({
        set: id
      })
    }
}])

  app.controller("setEditController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    var params = $location.search();
    $scope.paramGoods = params.set
    var oBase;
    $('#lightCustomModal').popup({
      pagecontainer: '.container',
      transition: 'all 0.3s'
    });
    $http.get("/home/brand/" + brandId + "/set/" + params.set).success(function (res) {
      $scope.goodsTypeName = res.sets.name
      $scope.sets = res.sets;
      $scope.sets.items.forEach(function (io) {
        io.addVegetableHide = true;
      })
      $http.get("/home/brand/" + brandId + "/set/update/base").success(function (base) {
        $scope.oBase = base;
        $scope.group = base.groups[0].id;
        $scope.allGroup = base.groups;
        var allSubgroup = [];
        base.subgroups.forEach(function (io) {
          if ($scope.group == io.group) {
            allSubgroup.push(io)
          }
        });
        $scope.allSubgroup = allSubgroup;
        $scope.subgroup = allSubgroup[0].id;
        var allGoods = [];
        $scope.allGoods = base.goodses.forEach(function (io) {
          if ($scope.subgroup == io.subgroup && $scope.group == io.group) {
            allGoods.push(io);
          }
        });
        $scope.allGoods = allGoods;
        $scope.goods = $scope.allGoods[0].id;
      })
    });

    $scope.groupChange = function () {
      var allSubgroup = [];
      $scope.oBase.subgroups.forEach(function (io) {
        if ($scope.group == io.group) {
          allSubgroup.push(io)
        }
      });
      $scope.allSubgroup = allSubgroup;
      $scope.subgroup = allSubgroup[0].id;
      var allGoods = [];
      $scope.allGoods = $scope.oBase.goodses.forEach(function (io) {
        if ($scope.subgroup == io.subgroup && $scope.group == io.group) {
          allGoods.push(io);
        }
      });
      $scope.allGoods = allGoods;
      $scope.goods = $scope.allGoods[0].id;

    }

    $scope.subgroupChange = function () {
      //  $scope.subgroup = $scope.allSubgroup[0].id;
      var allGoods = [];
      $scope.allGoods = $scope.oBase.goodses.forEach(function (io) {
        if ($scope.subgroup == io.subgroup && $scope.group == io.group) {
          allGoods.push(io);
        }
      });
      console.log(allGoods)
      $scope.allGoods = allGoods;
      $scope.goods = $scope.allGoods[0].id;
    }

    $scope.openDishModal = function (obj) {
      $('#addDishModal').modal();
      //$scope.group = $scope.oBase.groups[0].id;
      $scope.quantity = 1;
      $scope.plusPrice = 0;
      $scope.isDefault = false;
      $scope.addDish = function () {
        var json = {
          goods: $scope.goods,
          isDefault: $scope.isDefault,
          plusPrice: $scope.plusPrice,
          quantity: $scope.quantity
        }
        console.log(obj)
        $http.post("/home/brand/" + brandId + "/set/" + params.set + "/item/" + obj.id + "/detail", json).success(function (res) {
          $('#addDishModal').modal("hide");
          if (json.isDefault) {
            obj.details.forEach(function (io) {
              io.isDefault = false;
            })
          }
          obj.details.unshift({
            goods: res.goods,
            groupName: res.groupName,
            isDefault: res.isDefault,
            name: res.goodsName,
            plusPrice: res.plusPrice,
            quantity: res.quantity,
            subgroupName: res.subgroupName,
            unitTypeName: res.unitTypeName
          })
        }).error(function (error) {
          if (error.error_code == 1001) {
            alert("添加的菜品与道菜里的子菜有重复")
          }
        })
      }
    }
    $scope.editItemName = function (item) {
      $('#saveItemName').modal();
      $scope.itemName = item.name;
      $scope.saveItemName = function () {
        $http.post("/home/brand/" + brandId + "/set/" + params.set + "/item/" + item.id, {
          name: $scope.itemName
        }).success(function () {
          item.name = $scope.itemName;
          $('#saveItemName').modal("hide");
        })
      }
    }
    $scope.openDeleteItem = function (item, index) {
      $scope.deleteItem = function () {
        $http.delete("/home/brand/" + brandId + "/set/" + params.set + "/item/" + item.id).success(function () {
          $scope.sets.items.splice(index, 1);
        })
      }
    }
    $scope.closeVegeTable = function (obj) {
      obj.addVegetableHide = true;
    }
    $scope.isCreateItem = false;
    $scope.newItems = function () {
      $scope.isCreateItem = !$scope.isCreateItem;
    }
    $scope.closeCreateItem = function () {
      $scope.isCreateItem = false;
      $scope.itemName = "";
    }
    $scope.saveItem = function () {
      var json = {
        name: $scope.itemName
      }
      $http.post("/home/brand/" + brandId + "/set/" + params.set + "/item", json).success(function (res) {
        $scope.isCreateItem = false;
        $scope.itemName = "";
        res.details = [],
          $scope.sets.items.unshift(res)
      })
    }

    $scope.edit = function (details, items) {
      if (details.isEdit) return;
      items.temp = angular.copy(details);
      items.details.forEach(function (io) {
        if (io.isEdit) {
          io.quantity = items.temp.quantity;
          io.plusPrice = items.temp.plusPrice;
        }
        io.isEdit = false;
      })
      details.isEdit = true;
    }
    $scope.cancelEidit = function (details, items, e) {
      e.stopPropagation();
      details.quantity = items.temp.quantity;
      details.plusPrice = items.temp.plusPrice;
      details.isEdit = false;
    }

    $scope.default = function (obj, items, e) {
      console.log(obj);
      console.log(items)
      e.stopPropagation();
      var json = {
        goods: obj.goods
      }
      $http.post("/home/brand/" + brandId + "/set/" + params.set + "/item/" + items.id + "/default", json).success(function (res) {
        items.details.forEach(function (detail) {
          detail.isDefault = false;
        })
        obj.isDefault = true;
      })
    }

    $scope.deleteData = function (obj, items, index, e) {
      e.stopPropagation();
      $http.delete("/home/brand/" + brandId + "/set/" + params.set + "/item/" + items.id + "/detail/" + obj.goods).success(function (res) {
        if (res != null) {
          items.details.forEach(function (io) {
            if (io.goods == res.goods) {
              io.isDefault = true;
            }
          })
        }
        items.details.splice(index, 1)
      })
    }

    $scope.saveData = function (obj, items, e) {
      e.stopPropagation();
      var json = {
        goods: obj.goods,
        isDefault: obj.isDefault,
        plusPrice: obj.plusPrice,
        quantity: obj.quantity
      }
      $http.post("/home/brand/" + brandId + "/set/" + params.set + "/item/" + items.id + "/detail/" + obj.goods, json).success(function (res) {
        obj.isEdit = false;
      })
    }
  }])

  app.controller("setPriceController", ["$scope", "$http", "$location", "$timeout", "$document", function ($scope, $http, $location, $timeout, $document) {
    setTimeout(function () {
      $('.datepickerTime').datetimepicker()
    }, 300)
    $scope.showShopState = 1
    $scope.states = [{"id": 1, "name": "正在销售门店", "selected": false},{"id": 0, "name": "未销售门店", "selected": false}]
    $scope.goods = $location.search().set
    $scope.indexTab = "中国"
    $scope.isMenuOpen = false

    function getModels(province, city){
      var params = {province: province, city: city}
      var url = "/home/brand/" + brandId + "/goodsType/" + $scope.goodsType + "/apply/shop"
      $http.get(url, {params: params}).success(function (data) {
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
        $scope.tab($scope.showShopState)
      })
    }
    /**
     * 获取套餐的基本信息
     */
    $http.get("/home/brand/" + brandId + "/goods/" + $scope.goods + "/goodsType").success(function(data){
      $scope.goodsType = data.id
      $scope.goodsTypeName = data.name
      getModels()
    })

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
    $scope.tab = function(id){
      $scope.states.forEach(function(x){
        x.selected = false
        if(x.id == id){
          x.selected = true
        }
      })
      $scope.showShopState = id
      $scope.judgeAllSelected()
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
      var url = '/home/brand/' + brandId + '/goodsType/' + $scope.goodsType + '/apply/shop'
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
      var url = '/home/brand/' + brandId + '/goodsType/' + $scope.goodsType + '/apply/shop/' + shop
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
    $scope.selectAllShop = function(){
      $scope.models.forEach(function(model){
        if(model.hasApply == $scope.showShopState){
          model.selected = $scope.allSelected
        }
      })
      $scope.sourceModels.forEach(function(model){
        if(model.hasApply == $scope.showShopState){
          model.selected = $scope.allSelected
        }
      })
      $scope.batchAddShow = $scope.allSelected
      $scope.showAddBatch()
    }

    $scope.judgeAllSelected = function(){
      $scope.allSelected = true
      $scope.sourceModels.forEach(function(model){
        if(!model.selected && model.hasApply == $scope.showShopState){
          $scope.allSelected = false
          return
        }
      })
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

    function recoverModels(models){
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
      var url = "/home/brand/" + brandId + "/goodsType/" + $scope.goodsType + "/apply/shop/batch"
      if($scope.addModel.newPrice == undefined || $scope.addModel.newPrice.length == 0){
        delete $scope.addModel.newPrice
      }
      if($scope.addModel.newPrice == undefined || $scope.addModel.newPrice.length == 0){
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
        recoverModels($scope.sourceModels)
        recoverModels($scope.models)
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