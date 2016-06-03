define(["systemApp"], function(app) {
  app.controller("unitController", ["$rootScope", '$scope', '$http', '$location', '$timeout',
    function($rootScope, $scope, $http, $location, $timeout) {
      $http.get("/home/brand/" + brandId + "/unitTypes").success(function(data) {
        //console.log(data);
        //var states = data.states;
        //console.log(res);
        data.forEach(function(obj) {
          obj.editing = false;
          obj.editType = "edit";
        })
        $scope.unitTypeData = data;
      })

      $scope.addUnitType = function() {
        $scope.unitTypeData.splice(0, 0, {
          brand: brandId,
          name: "",
          remark: "",
          order: 0, //0
          editing: true,
          editType: "add",
          nameError: false
        })
        setTimeout(function() {
          $(".editing").find("input").eq(0).trigger("select");
        }, 100)

      }

      $scope.editing = function(obj) {
        if (!obj.editing) {
          $scope.unitTypeData.forEach(function(io) {
            if (io.editing) {
              io.editing = !io.editing;
              io.editType = $scope.tmp_data.editType;
              io.editing = $scope.tmp_data.editing;
              io.id = $scope.tmp_data.id;
              io.name = $scope.tmp_data.name;
              io.remark = $scope.tmp_data.remark;
            }
            io.editing = false;
          })
          $scope.tmp_data = angular.copy(obj);

          setTimeout(function() {
            $(".editing").find("input").eq(0).trigger("select");
          }, 100)
          obj.editing = true;

        }

      }

      $scope.cancelEdit = function(obj, $event) {
        if ($event) {
          $event.stopPropagation();
        }
        if (obj.editType == "add") {
          $scope.unitTypeData.splice(0, 1);
        } else {
          obj.editing = !obj.editing;
          obj.editType = $scope.tmp_data.editType;
          obj.editing = $scope.tmp_data.editing;
          obj.id = $scope.tmp_data.id;
          obj.name = $scope.tmp_data.name;
          obj.remark = $scope.tmp_data.remark;
          // console.log(obj);
        }
      }
      $scope.stopPropagation = function(e) {
        e.stopPropagation();
      }
      $scope.savePayment = function(obj, $event) {
        if ($event) {
          $event.stopPropagation()
        }
        if ($event.type == "click" || $event.keyCode == 13) {
          if (obj.name == "") {
            obj.nameError = true;
          } else {
            obj.nameError = false;
            if (obj.editType == "add") {
              $http.post("/home/brand/" + brandId + "/unitType/add", obj).success(function(res) {
                //console.log("添加成功")
                obj.editType = "edit";
                obj.id = res.id;
                obj.editing = false;
              }).error(function(res) {
                alert(res.message)
              })
            } else {
              $http.post(" /home/brand/" + brandId + "/unitType/" + obj.id + "/update", obj).success(function(res) {
                obj.editing = false;
              }).error(function(res) {
                alert(res.message)
              })
            }
          }
        }

      }

      $scope.updateState = function(obj, index) {
        $http.delete("/home/brand/" + brandId + "/unitType/" + obj.id + "/delete").success(function(res) {
          //location.reload(true);
          $scope.unitTypeData.splice(index, 1);

        }).error(function(res) {
          alert(res.message);
        })
      }


    }
  ])
})
