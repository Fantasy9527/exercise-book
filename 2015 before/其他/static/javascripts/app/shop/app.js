define(["asyncLoader", "angular", "uiRouter"], function(asyncLoader) {
  var app = angular.module('sanyiapp', ['ui.router']);
  asyncLoader.configure(app);
  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/info');
    var nav = function() {
      return angular.copy({
        templateUrl: '/assets/templates/shop/nav.html',
        controller: 'navController',
        controllerUrl: "/assets/javascripts/app/shop/navController.js"
      })
    }
    $stateProvider
      .state('info', {
        url: '/info',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/info.html',
            controller: 'infoController',
            controllerUrl: "/assets/javascripts/app/shop/infoController.js"
          }
        }
      })
      .state('config', {
        url: '/config',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/config.html',
            controller: 'configController',
            controllerUrl: "/assets/javascripts/app/shop/configController.js"
          }
        }
      })
      .state('role', {
        url: '/role',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/role.html',
            controller: 'roleController',
            controllerUrl: "/assets/javascripts/app/shop/roleController.js"
          }
        }
      })
      .state('staff', {
        url: '/staff',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/staff.html',
            controller: 'staffController',
            controllerUrl: "/assets/javascripts/app/shop/staffController.js"
          }
        }
      })
      .state('table', {
        url: '/table',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/table.html',
            controller: 'tableController',
            controllerUrl: "/assets/javascripts/app/shop/tableController.js"
          }
        }
      })
      .state('printer', {
        url: '/printer',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/printer.html',
            controller: 'printerController',
            controllerUrl: "/assets/javascripts/app/shop/printerController.js"
          }
        }
      })
      .state('pos', {
        url: '/pos',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/pos.html',
            controller: 'posController',
            controllerUrl: "/assets/javascripts/app/shop/posController.js"
          }
        }
      })
      .state('printing', {
        url: '/printing',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/printing.html',
            controller: 'printingController',
            controllerUrl: "/assets/javascripts/app/shop/printingController.js"
          }
        }
      })
      .state('correlation', {
        url: '/correlation',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/correlation.html',
            controller: 'correlationController',
            controllerUrl: "/assets/javascripts/app/shop/correlationController.js"
          }
        }
      })
      .state('discount', {
        url: '/discount',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/discount.html',
            controller: 'discountController',
            controllerUrl: "/assets/javascripts/app/shop/discountController.js"
          }
        }
      })
      .state('lineup', {
        url: '/lineup',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/lineup.html',
            controller: 'lineupController',
            controllerUrl: "/assets/javascripts/app/shop/lineupController.js"
          }
        }
      })
      .state('payment', {
        url: '/payment',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/hasPayment.html',
            controller: 'hasPaymentController',
            controllerUrl: "/assets/javascripts/app/shop/hasPaymentController.js"
          }
        }
      })
      .state('managers', {
        url: '/managers',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/shop/managers.html',
            controller: 'managersController',
            controllerUrl: "/assets/javascripts/app/shop/managersController.js"
          }
        }
      })
  })
  app.run(function($rootScope) {
    $rootScope.brandId = brandId;
    $rootScope.shopId = shopId;
  })
  return app;
})
