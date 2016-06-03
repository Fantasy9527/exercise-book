define(["systemApp","popupoverlay"], function(app) {
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
})
