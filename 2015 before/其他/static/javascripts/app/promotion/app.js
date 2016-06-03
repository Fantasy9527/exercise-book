define(["asyncLoader", "angular", "uiRouter"], function(asyncLoader) {
  var app = angular.module('sanyiapp', ['ui.router']);
  asyncLoader.configure(app);
  app.run(function($rootScope) {
    $rootScope.brandId = location.pathname.replace('/home/brand/', '').replace(/(\w+)(\/.+)?/gi, "$1");
    $rootScope.toback = function() {
      history.back(-1);
    }
  })
  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/create');
    $stateProvider
      .state('create', { //创建促销列表
        url: '/create',
        templateUrl: '/assets/templates/promotion/create.html',
        controller: 'createController',
        controllerUrl: '/assets/javascripts/app/promotion/createController.js'
      })
      .state("voucherManage", { //券管理
        url: "/voucherManage",
        templateUrl: "/assets/templates/promotion/voucherManage.html",
        controller: "voucherManageController",
        controllerUrl: '/assets/javascripts/app/promotion/voucherManageController.js'
      })
      .state('voucher', { //代金券添加
        url: '/voucher',
        templateUrl: '/assets/templates/promotion/voucher.html',
        controller: 'voucherController',
        controllerUrl: '/assets/javascripts/app/promotion/voucherController.js'
      }).state("voucherEdit", {
        url: "/voucherEdit?voucherId",
        templateUrl: '/assets/templates/promotion/voucherEdit.html',
        controller: 'voucherEditController',
        controllerUrl: '/assets/javascripts/app/promotion/voucherEditController.js'
      })
      .state('promotion', { //促销列表
        url: '/promotion',
        templateUrl: '/assets/templates/promotion/table.html',
        controller: 'promotionManageController',
        controllerUrl: '/assets/javascripts/app/promotion/promotionManageController.js'
      })
      .state("promotionDetails", { //预览
        url: "/detail",
        templateUrl: '/assets/templates/promotion/promotionDetails.html',
        controller: 'promotionDetailsController',
        controllerUrl: '/assets/javascripts/app/promotion/promotionDetailsController.js'
      })
      .state('promotion1', { //特价
        url: '/promotion1',
        templateUrl: '/assets/templates/promotion/promotion.html',
        controller: 'promotion1Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion1Controller.js'
      }).state('promotion3', { //代金券
        url: '/promotion3',
        templateUrl: '/assets/templates/promotion/promotion3.html',
        controller: 'promotion3Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion3Controller.js'
      }).state('promotion4', {
        url: '/promotion4',
        templateUrl: '/assets/templates/promotion/promotion4.html',
        controller: 'promotion4Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion4Controller.js'
      }).state('promotion5', {
        url: '/promotion5',
        templateUrl: '/assets/templates/promotion/promotion5.html',
        controller: 'promotion5Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion5Controller.js'
      }).state('promotion6', {
        url: '/promotion6',
        templateUrl: '/assets/templates/promotion/promotion6.html',
        controller: 'promotion6Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion6Controller.js'
      }).state('promotion9', { //会员价格
        url: '/promotion9',
        templateUrl: '/assets/templates/promotion/promotion9.html',
        controller: 'promotion9Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion9Controller.js'
      }).state('promotion10', { //会员折扣
        url: '/promotion10',
        templateUrl: '/assets/templates/promotion/promotion10.html',
        controller: 'promotion10Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion10Controller.js'
      }).state('promotion11', { //打折促销
        url: '/promotion11',
        templateUrl: '/assets/templates/promotion/promotion11.html',
        controller: 'promotion11Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion11Controller.js'
      }).state('promotion12', { //开卡赠券
        url: '/promotion12',
        templateUrl: '/assets/templates/promotion/promotion12.html',
        controller: 'promotion12Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion12Controller.js'
      }).state('promotion13', { //开卡赠券
        url: '/promotion13',
        templateUrl: '/assets/templates/promotion/promotion13.html',
        controller: 'promotion13Controller',
        controllerUrl: '/assets/javascripts/app/promotion/promotion13Controller.js'
      })
      .state("promotionEdit1", { //特价编辑
        url: "/promotionEdit1",
        templateUrl: '/assets/templates/promotion/promotionEdit1.html',
        controller: 'Edit1Controller',
        controllerUrl: '/assets/javascripts/app/promotion/Edit1Controller.js'
      }).state("promotionEdit9", {
        url: "/promotionEdit9",
        templateUrl: '/assets/templates/promotion/promotionEdit9.html',
        controller: 'Edit9Controller',
        controllerUrl: '/assets/javascripts/app/promotion/Edit9Controller.js'
      }).state("promotionEdit10", {
        url: "/promotionEdit10",
        templateUrl: '/assets/templates/promotion/promotionEdit10.html',
        controller: 'Edit10Controller',
        controllerUrl: '/assets/javascripts/app/promotion/Edit10Controller.js'
      }).state('promotionEdit11', { //打折促销
        url: '/promotionEdit11',
        templateUrl: '/assets/templates/promotion/promotionEdit11.html',
        controller: 'Edit11Controller',
        controllerUrl: '/assets/javascripts/app/promotion/Edit11Controller.js'
      })
      .state('promotionEdit12', { //打折促销
        url: '/promotionEdit12',
        templateUrl: '/assets/templates/promotion/promotionEdit12.html',
        controller: 'Edit12Controller',
        controllerUrl: '/assets/javascripts/app/promotion/Edit12Controller.js'
      })
  });
  return app
})
