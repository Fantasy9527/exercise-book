define(["shopApp"], function(app) {
  app.controller("hasPaymentController", ["$scope", "$http", function($scope, $http) {
    $http.get("/home/brand/" + brandId + "/shop/" + shopId + "/has/payments").success(function(res) {
      $scope.hasPaymentData = res;
    })
    $scope.paymentSel = function(obj) {
      $http.post("/home/brand/" + brandId + "/shop/" + shopId + "/has/payment/" + obj.id).success(function() {
        obj.selected = true;
      })
    }
    $scope.cancelSel = function(obj) {
      $http.delete("/home/brand/" + brandId + "/shop/" + shopId + "/has/payment/" + obj.id).success(function() {
        obj.selected = false;
      })
    }
  }])
})
