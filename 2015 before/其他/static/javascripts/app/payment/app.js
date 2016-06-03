define(["angular","uiRouter"],function(){
  var app = angular.module('sanyiapp', ['ui.router']);
var brandId = location.pathname.replace('/home/brand/', '').replace(/(\w+)(\/.+)?/gi, "$1");
  app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/assets/templates/custom/payment.html',
        controller: 'paymentController'
      })
  })
app.controller("paymentController", ["$scope", "$http", function ($scope, $http) {
    $http.get("/home/brand/" + brandId + "/custom/payments").success(function (data) {
		var res = data.paymentModes;
		var states = data.states;
        $scope.states = states
        //console.log(res);
        res.forEach(function (obj) {
            obj.editing = false;
            obj.editType = "edit";
			states.forEach(function(state){
				if(obj.state == state.id){
					obj.state = state;
					return;
				}
			})
        })
        $scope.payData = res;
    })

    $scope.addPayment = function () {
        $scope.hasAdding = true;
        $scope.payData.splice(0,0,{
            name: "",
            remark: "",
            editing: true,
            editType: "add",
            nameError: false
        })
    }

    $scope.editing = function (obj) {
        $scope.payData.forEach(function(io){
            io.editing=false;
        })
        $scope.tmp_data = angular.copy(obj);
        
        obj.editing = true;
    }

    $scope.cancelEdit = function (obj,$event) {
        $scope.hasAdding = false;
        /*if($event){
        $event.stopPropagation();
        }
        if (obj.editType == "add") {
            $scope.payData.splice(0,1);
        } else {
            obj.editing = !obj.editing;
            obj.editType = $scope.tmp_data.editType;
            obj.editing = $scope.tmp_data.editing;
            obj.id = $scope.tmp_data.id;
            obj.name = $scope.tmp_data.name;
            obj.remark = $scope.tmp_data.remark;
           // console.log(obj);
        }*/
        location.reload()
    }

    $scope.savePayment = function (obj,$event) {
        if($event){
        $event.stopPropagation()
        }
        if (obj.name == "") {
            obj.nameError = true;
        } else {
            obj.nameError = false;
            obj.editing = !obj.editing;
            if (obj.editType == "add") {
                $http.post("/home/brand/" + brandId + "/custom/payment", obj).success(function (res) {
                    //console.log("添加成功")
                    $scope.hasAdding = false;
                    obj.editType = "edit";
                    obj.id = res.id;
					obj.state = 1;
                    $scope.states.forEach(function(state){
                        if(obj.state == state.id){
                            obj.state = state;
                            return;
                        }
                    })
                }).error(function(data){
                    obj.editing=true
					alert(data.message)
				})
            } else {
                $http.post("/home/brand/" + brandId + "/custom/payment/" + obj.id, obj).success(function (res) {
                    //console.log("修改成功");
                }).error(function(data){
                    obj.editing=true
					alert(data.message)
				})
            }
        }
    }

    $scope.updateState = function (obj) {
		var postModel = {};
		if(obj.state.id != 1){
			postModel.state = 1;
		}else{
			postModel.state = 2;
		}
        $http.post("/home/brand/" + brandId + "/custom/payment/" + obj.id + "/state", postModel).success(function (res) {
            location.reload(true);
        })
    }
}])
})
