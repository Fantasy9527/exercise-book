define(["promotionApp"], function (promotionApp) {
  var app = promotionApp;
app.controller('promotion5Controller', ['$scope', '$http', '$location', 'proSrv',
  function ($scope, $http, $location, proSrv) {

    $('.datepickerTime').datetimepicker();
      //选择门店
    proSrv.selShop($scope, $http);
    //自定义时间
    proSrv.selTime($scope, $http)
      //添加菜品
    proSrv.addDishes($scope, $http);
    //添加不参加时间
    proSrv.nonparticipator($scope, $http);
    //参加市别
    proSrv.servicehours($scope, $http);
    //单选菜品
    proSrv.selDishes($scope, $http
  }
])
})
