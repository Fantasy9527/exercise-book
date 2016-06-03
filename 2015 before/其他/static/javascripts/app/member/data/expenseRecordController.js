define(["memberApp","datetimepicker", "tool"],function(app){
  /*会员消费记录controller*/
  app.controller('expenseRecordController', function($scope, $http, $stateParams) {
      $scope.memberId = $stateParams.memberId;
      $scope.showDetail = -1;
      $scope.cutRecord = function() {
          var getRecord = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/expend/records?member=' + $scope.memberId + '&begin=' + '1914-01-01';
          $http.get(getRecord).success(function(data) {
              $scope.models = data.stats;
              $scope.models.forEach(function(model) {
                  data.shops.forEach(function(shop) {
                      if (shop.id == model.stat.shop) {
                          model.stat.shop = shop;
                      }
                  })
                  model.stat.stat.total.amount = model.stat.stat.total.amount.toFixed(2)
              })
          })
      }
      $scope.cutRecord()
      $scope.showOrHideDetailArea = function(id) {
          if ($scope.showDetail != id) {
              $scope.showDetail = id
              var getRecordDetail = '/home/brand/' + brandId + '/member/stat/bill/total/' + id
              $http.get(getRecordDetail).success(function(data) {
                  $scope.orders = []
  				$scope.tableNames = ""
  				$scope.personCount = 0
  				$scope.goodsCount = 0
  				data.orders.forEach(function(order){
  					$scope.tableNames = $scope.tableNames + order._table.name + "、"
  					$scope.personCount += order.person_count
  					$scope.goodsCount += order._details.length
  					order._details.forEach(function(detail){
  						detail.order_time = detail.order_time.split(" ")[1]
  						if (detail._goods.productType == 2) { //称重菜品的数量需要特殊处理
  							detail.quantity = detail.weight
  							if (detail.void_quantity == 1) {
  								detail.void_quantity = detail.weight
  							}
  						}
  						$scope.orders.push(detail)
  					})
  				})
  				$scope.tableNames = $scope.tableNames.substring(0, $scope.tableNames.length-1)
                  $scope.modelDetail = data.stat
                  $scope.modelDetail.account = $scope.modelDetail.stat.total.origin - $scope.modelDetail.stat.waive.discount - $scope.modelDetail.stat.waive.promotion - $scope.modelDetail.stat.waive.rounding - $scope.modelDetail.stat.waive.freeWaive + $scope.modelDetail.stat.waive.surcharge + $scope.modelDetail.stat.waive.mincharge;
                  $scope.modelDetail.account = Math.round($scope.modelDetail.account * 100) / 100;

                  $scope.modelDetail.totalAmount = $scope.modelDetail.stat.pay.cash + $scope.modelDetail.stat.pay.card + $scope.modelDetail.stat.pay.alipay + $scope.modelDetail.stat.pay.tenpay + $scope.modelDetail.stat.pay.voucher + $scope.modelDetail.stat.pay.debit + $scope.modelDetail.stat.pay.storevalue + $scope.modelDetail.stat.pay.waive + $scope.modelDetail.stat.pay.custom;
                  $scope.modelDetail.totalAmount = Math.round($scope.modelDetail.totalAmount * 100) / 100;

                  $scope.modelDetail.stat.total.current = $scope.modelDetail.stat.total.current.toFixed(2)
  				$scope.modelDetail.stat.total.origin = $scope.modelDetail.stat.total.origin.toFixed(2)
                  $scope.modelDetail.stat.waive.promotion = $scope.modelDetail.stat.waive.promotion.toFixed(2)
                  $scope.modelDetail.stat.waive.discount = $scope.modelDetail.stat.waive.discount.toFixed(2)
                  $scope.modelDetail.stat.waive.mincharge = $scope.modelDetail.stat.waive.mincharge.toFixed(2)
                  $scope.modelDetail.stat.waive.surcharge = $scope.modelDetail.stat.waive.surcharge.toFixed(2)
                  $scope.modelDetail.stat.waive.rounding = $scope.modelDetail.stat.waive.rounding.toFixed(2)
              })
          } else {
              $scope.showDetail = -1
          }
      }
  })
})
