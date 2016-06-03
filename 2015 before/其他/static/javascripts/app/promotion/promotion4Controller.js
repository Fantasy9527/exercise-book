define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
app.controller('promotion4Controller', ['$scope', '$http', '$location', 'proSrv',
  function($scope, $http, $location, proSrv) {
    $('.datepickerTime').datetimepicker();
      //添加菜品
    proSrv.addDishes($scope, $http);
    //自定义时间
    proSrv.selTime($scope, $http);
    //选择门店
    proSrv.selShop($scope, $http);
    //添加不参加时间
    proSrv.nonparticipator($scope, $http);
    //参加市别
    proSrv.servicehours($scope, $http);
    //价格方案
    // proSrv.addPrices($scope, $http);
    //单选菜品
    proSrv.selDishes($scope, $http);
  }
])
})
