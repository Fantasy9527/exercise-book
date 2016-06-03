define(["systemApp"], function(app) {
  app.controller("setController", ["$scope", "$http", "$location","$state", function ($scope, $http, $location,$state) {
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


}])
})
