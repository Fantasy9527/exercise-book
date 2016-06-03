define(["asyncLoader", "angular", "uiRouter"], function(asyncLoader) {
  var app = angular.module('sanyiapp', ['ui.router']);
  asyncLoader.configure(app);
  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/goods');
    var nav = function() {
      return angular.copy({
        templateUrl: '/assets/templates/price/nav.html',
        controller: 'navController',
        controllerUrl: "/assets/javascripts/app/price/navController.js"
      })
    }
    $stateProvider
      .state('goods', {
        url: '/goods',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/price/goods.html',
            controller: 'goodsController',
            controllerUrl: "/assets/javascripts/app/price/goodsController.js"
          }
        }
      })
      .state('method', {
        url: '/method',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/price/method.html',
            controller: 'methodController',
            controllerUrl: "/assets/javascripts/app/price/methodController.js"
          }
        }
      })
      .state('surcharge', {
        url: '/surcharge',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/price/surcharge.html',
            controller: 'surchargeController',
            controllerUrl: "/assets/javascripts/app/price/surchargeController.js"
          }
        }
      })
      .state("exception", {
        url: "/surcharge/exception?surcharge&percentage",
        views: {
          nav: nav(),
          content: {
            templateUrl: "/assets/templates/price/surcharge.exception.html",
            controller: "surcharge.exceptionController",
            controllerUrl: "/assets/javascripts/app/price/surcharge.exceptionController.js"
          }
        }
      })
      .state('mincharge', {
        url: '/mincharge',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/price/mincharge.html',
            controller: 'minchargeController',
            controllerUrl: "/assets/javascripts/app/price/minchargeController.js"
          }
        }
      })
      .state('teafee', {
        url: '/teafee',
        views: {
          nav: nav(),
          content: {
            templateUrl: '/assets/templates/price/teafee.html',
            controller: 'teafeeController',
            controllerUrl: "/assets/javascripts/app/price/teafeeController.js"
          }
        }
      })
  })
  app.run(function($rootScope) {
    $rootScope.brandId = brandId;
    $rootScope.planId = planId;
  })
  return app;
})
