define(["asyncLoader", "angular", "uiRouter", "angularFileUpload","ngTagsInput","gritter"], function(asyncLoader) {
  var app = angular.module('sanyiapp', ['ui.router', "angularFileUpload","ngTagsInput"]);
  asyncLoader.configure(app);
  app.run(function($rootScope) {
    $rootScope.brandId = location.pathname.replace('/home/brand/', '').replace(/(\w+)(\/.+)?/gi, "$1");
    $rootScope.toback = function() {
      history.back(-1);
    }
    $rootScope.$on("$stateChangeSuccess", function(angularEvent, current, previous) {
      document.title = current.title;
      $rootScope.currentTitle = current.title
    });
  })
  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/system').when("", "/system");
    $stateProvider
      .state('system', {
        url: '/system',
        title: "系统设置",
        views: {
          "": {
            templateUrl: '/assets/templates/system/main.html',
          },
          "main@system": {
            templateUrl: '/assets/templates/system/system.html',
            controller: 'systemController',
            controllerUrl: '/assets/javascripts/app/system/systemController.js'
          }
        }
      })
      .state('system.group', { //分类
        url: '/group',
        title: "菜品分类",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/group.html',
            controller: 'groupController',
            controllerUrl: '/assets/javascripts/app/system/groupController.js'
          }
        }
      })
      .state('system.goods', { //菜品
        url: '/goods',
        title: "菜品资料",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/goods.html',
            controller: 'goodsController',
            controllerUrl: '/assets/javascripts/app/system/goodsController.js'
          }
        }
      })
      .state('system.goods.detail', { //菜品
        url: '/detail/:goodsTypeId',
        title: "菜品详情",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/goods.detail.html',
            controller: 'goodsDetailController',
            controllerUrl: '/assets/javascripts/app/system/goods.detailController.js'
          }
        }
      })
      .state('system.goods.apply', { //菜品应用到门店
        url: '/apply/:goodsTypeId',
        title: "菜品定价",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/goods.apply.html',
            controller: 'goodsApplyController',
            controllerUrl: '/assets/javascripts/app/system/goods.applyController.js'
          }
        }
      })
      .state('system.unit', { //规格
        url: '/unit',
        title: "规格管理",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/unit.html',
            controller: 'unitController',
            controllerUrl: '/assets/javascripts/app/system/unitController.js'
          }
        }

      })
      .state('system.method', { //做法
        url: '/method',
        title: "做法管理",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/method.html',
            controller: 'methodController',
            controllerUrl: '/assets/javascripts/app/system/methodController.js'
          }
        }
      })
      .state('system.set', { //套餐
        url: '/set',
        title: "套餐管理",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/set/set.html',
            controller: 'setController',
            controllerUrl: '/assets/javascripts/app/system/set/setController.js'
          }
        }
      })
      .state('system.set.edit', { //套餐编辑
        url: '/edit?set',
        title: "套餐编辑",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/set/set.edit.html',
            controller: 'setEditController',
            controllerUrl: '/assets/javascripts/app/system/set/setEditController.js'
          }
        }
      })
      .state('system.set.price', { //套餐定价
        url: '/price?set',
        title: "套餐定价",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/set/set.price.html',
            controller: 'setPriceController',
            controllerUrl: '/assets/javascripts/app/system/set/setPriceController.js'
          }
        }
      })
      .state('system.tabletype', { //餐桌类型
        url: '/tabletype',
        title: "餐桌类型",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/tabletype.html',
            controller: 'tabletypeController',
            controllerUrl: '/assets/javascripts/app/system/tabletypeController.js'
          }
        }

      })
      .state('system.discount', { //折扣
        url: '/discount',
        title: "折扣设置",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/discount/discount.html',
            controller: 'discountController',
            controllerUrl: '/assets/javascripts/app/system/discount/discountController.js'
          }
        }
      })
      .state('system.discount.detail', { //折扣
        url: '/detail/:discount',
        title: "折扣详情",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/discount/discount.detail.html',
            controller: 'discount.detailController',
            controllerUrl: '/assets/javascripts/app/system/discount/discount.detailController.js'
          }
        }
      })
      .state('system.discount.scope', { //折扣
        url: '/scope/:discount',
        title: "适用门店",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/discount/discount.scope.html',
            controller: 'discount.scopeController',
            controllerUrl: '/assets/javascripts/app/system/discount/discount.scopeController.js'
          }
        }
      })
      .state('system.discount.exception', { //折扣
        url: '/exception/discount/:discount/subgroup/:subgroup',
        title: "折扣例外菜品",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/discount/discount.exception.html',
            controller: 'discount.exceptionController',
            controllerUrl: '/assets/javascripts/app/system/discount/discount.exceptionController.js'
          }
        }
      })
      .state('system.servicehour', { //营业市别
        url: '/servicehour',
        title: "营业市别",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/servicehour.html',
            controller: 'servicehourController',
            controllerUrl: '/assets/javascripts/app/system/servicehourController.js'
          }
        }

      })
      .state('system.payments', { //收银方式
        url: '/payments',
        title: "收银方式",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/payments.html',
            controller: 'paymentsController',
            controllerUrl: '/assets/javascripts/app/system/paymentsController.js'
          }
        }
      })
      .state('system.team', { //账号管理
        url: '/team',
        title: "账号管理",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/team.html',
            controller: 'teamController',
            controllerUrl: '/assets/javascripts/app/system/teamController.js'
          }
        }

      })
      .state('system.settings', { //参数设置
        url: '/settings',
        title: "参数设置",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/settings.html',
            controller: 'settingsController',
            controllerUrl: '/assets/javascripts/app/system/settingsController.js'
          }
        }

      })
      .state('system.auditlog', { // 审计日志
        url: '/auditlog',
        title: "审计日志",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/auditlog.html',
            controller: 'auditlogController',
            controllerUrl: '/assets/javascripts/app/system/auditlogController.js'
          }
        }

      })

    .state('system.statManage', { // 数据管理
      url: '/statManage',
      title: "数据管理",
      views: {
        'main@system': {
          templateUrl: '/assets/templates/system/statManage.html',
          controller: 'statManageController',
          controllerUrl: '/assets/javascripts/app/system/statManageController.js'
        }
      }

    })

    /**
     * --------------------
     * 微信部分
     */
    .state('system.platform', { // 微信
        url: '/platform',
        title: "微信设置",
        views: {
          'main@system': {
            templateUrl: '/assets/templates/system/platform/platform.html',
            controller: 'platformController',
            controllerUrl: '/assets/javascripts/app/system/platform/platformController.js'
          }
        }
      })
      // .state("system.platform.", {
      //   url: "/",
      //   views: {
      //     '': {
      //       templateUrl: '/assets/templates/weixin/index.html'
      //     },
      //     "nav@system": {
      //       templateUrl: "/assets/templates/system/nav.html",
      //       controller: "navController",
      //       controllerUrl: '/assets/javascripts/app/system/platform/navController.js'
      //     }
      //   }
      // })
      //会员设置
      .state("system.platform.memberset", {
        url: "/memberset?auId",
        title: "会员设置",
        views: {
          "nav@system": platformNav(),
          "main@system": {
            templateUrl: "/assets/templates/system/platform/memberSet.html",
            controller: "membersetController",
            controllerUrl: '/assets/javascripts/app/system/platform/membersetController.js'
          }
        }
      })
      //菜单设置
      .state("system.platform.menuset", {
        url: "/menuset?auId",
        title: "菜单设置",
        views: {
          "nav@system": platformNav(),
          "main@system": {
            templateUrl: "/assets/templates/system/platform/menuSet.html",
            controller: "menusetController",
            controllerUrl: '/assets/javascripts/app/system/platform/menusetController.js'
          }
        }
      })
      //关键字回复
      .state("system.platform.keywordReply", {
        url: "/keywordreply?auId",
        title: "关键字回复",
        views: {
          "nav@system": platformNav(),
          "main@system": {
            templateUrl: "/assets/templates/system/platform/keywordReply.html",
            controller: "keywordreplyController",
            controllerUrl: '/assets/javascripts/app/system/platform/keywordreplyController.js'
          }
        }
      })
      //欢迎用语
      .state("system.platform.welcome", {
        url: "/welcome?auId",
        title: "欢迎用语",
        views: {
          "nav@system": platformNav(),
          "main@system": {
            templateUrl: "/assets/templates/system/platform/welcome.html",
            controller: "welcomeController",
            controllerUrl: '/assets/javascripts/app/system/platform/welcomeController.js'
          }
        }
      })
      //关键字添加
      .state("system.platform.replyDetail", {
        url: "/replyDetail?auId",
        title: "关键字添加",
        views: {
          "main@system": {
            templateUrl: "/assets/templates/system/platform/replyDetail.html",
            controller: "replyDetailConyroller",
            controllerUrl: '/assets/javascripts/app/system/platform/replyDetailConyroller.js'
          }
        }
      })
      //关键字修改
      .state("system.platform.replySet", {
        url: "/replySet/regulation/:regId/auth/:auId/t/:tId",
        title: "关键字修改",
        views: {
          "main@system": {
            templateUrl: "/assets/templates/system/platform/replyDetail.html",
            controller: "replySetConyroller",
            controllerUrl: '/assets/javascripts/app/system/platform/replySetConyroller.js'
          }
        }
      })

    function platformNav() {
      return {
        templateUrl: "/assets/templates/system/platform/nav.html",
        controller: "navController",
        controllerUrl: '/assets/javascripts/app/system/platform/navController.js'
      }
    }


  });
  return app
})
