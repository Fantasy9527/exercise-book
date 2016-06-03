define(["memberApp","datetimepicker", "tool"],function(app){
  /*会员充值记录controller*/
  app.controller('chargeRecordController', function($scope, $http, $stateParams) {
          $scope.memberId = $stateParams.memberId;
          $scope.showDetail = -1;

          $scope.currentPage = 1;
          $scope.pageSize = 1000;

          $scope.postModel = {};
          $scope.postModel.page = $scope.currentPage;
          $scope.postModel.page_size = $scope.pageSize;

          $scope.getRecords = function() {
              var getRecord = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/recharge/records';
              $http.post(getRecord, $scope.postModel).success(function(data) {
                  $scope.models = data.rechargeRecords;
                  var chargePayMents = data.chargePayMents;
                  var staffs = data.staffs;
                  $scope.models.forEach(function(model) {
                      chargePayMents.forEach(function(chargePayMent) {
                          if (chargePayMent.member_charge_id == model.id) {
                              if (chargePayMent.payment_type_id == 1) {
                                  model.cashPay = chargePayMent;
                              }
                              if (chargePayMent.payment_type_id == 2) {
                                  model.cardPay = chargePayMent;
                              }
                              if (chargePayMent.payment_type_id == 4) {
                                  model.aliPay = chargePayMent;
                              }
                              if (chargePayMent.payment_type_id == 5) {
                                  model.weixinPay = chargePayMent;
                              }
                          }
                      })

                      staffs.forEach(function(staff) {
                          if (staff.id == model.sale_staff_id) {
                              model.saleStaff = staff;
                          }
                          if (staff.id == model.staff_id) {
                              model.staff = staff;
                          }
                      })
                  })
              })
          }
          $scope.getRecords();

          var getRecordCount = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/recharge/records/count';
          $http.post(getRecordCount, $scope.postModel).success(function(data) {
              $scope.recordCount = data.count;
          })

          $scope.showOrHideDetailArea = function(id) {
              if ($scope.showDetail != id) {
                  $scope.showDetail = id;
                  var getRecordDetail = '/home/brand/' + brandId + '/member/stat/bill/total/' + id;
                  $http.get(getRecordDetail).success(function(data) {
                      $scope.orders = data.orders[0];
                      $scope.modelDetail = data.stat;
                  })
              } else {
                  $scope.showDetail = -1;
              }
          }
          $scope.shareObject = {};
          $scope.searchMembers = function() {
              $scope.currentPage = $scope.shareObject.currentPage;
              $scope.postModel.page = $scope.currentPage;
              $scope.getRecords();
          }
      })
})
