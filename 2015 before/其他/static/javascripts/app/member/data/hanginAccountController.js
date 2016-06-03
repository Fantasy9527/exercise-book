define(["memberApp"],function(app){
  /*会员挂账记录controller*/
app.controller('hanginAccountController', function($scope, $http, $stateParams) {
      $scope.memberId = $stateParams.memberId;
      // $scope.showDetail = -1;
      //
      // var getRecord = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/expend/records?member=' + $scope.memberId + '&begin=' + '1914-01-01' + '&page=0';
      // $http.get(getRecord).success(function(data) {
      //     $scope.models = data.stats;
      //     $scope.pageSize = data.pages.pageSize;
      //     $scope.page = data.pages.current + 1;
      //     $scope.recordCount = data.pages.total;
      // })
      //
      //
      // $scope.showOrHideDetailArea = function(id) {
      //     if ($scope.showDetail != id) {
      //         $scope.showDetail = id;
      //         var getRecordDetail = '/home/brand/' + brandId + '/member/stat/bill/total/' + id;
      //         $http.get(getRecordDetail).success(function(data) {
      //             $scope.orders = data.orders[0];
      //             $scope.modelDetail = data.stat;
      //         })
      //     } else {
      //         $scope.showDetail = -1;
      //     }
      // }
      // $scope.searchMembers = function() {
      //     $scope.page = $scope.shareObject.currentPage;
      //     $scope.cutRecord();
      // }
  })
})
