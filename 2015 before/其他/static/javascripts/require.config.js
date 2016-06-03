 require.config({
   paths: {
     "jquery": "/assets/endless/js/jquery-1.11.1.min",
     "bootstrap": "/assets/endless/js/bootstrap.min",
     "echarts": "/assets/javascripts/eCharts/echarts",
     "cockpit": "/assets/javascripts/cockpit",
     "moment": "/assets/javascripts/moment",
     "momentWithLangs": "/assets/javascripts/moment-with-langs",
     "datetimepicker": "/assets/javascripts/bootstrap-datetimepicker.min",
     "pace": "/assets/endless/js/pace.min",
     "popupoverlay": "/assets/endless/js/jquery.popupoverlay.min",
     "slimscroll": "/assets/endless/js/jquery.slimscroll.min",
     "modernizr": "/assets/endless/js/modernizr.min",
     "cookie": "/assets/endless/js/jquery.cookie.min",
     "endless": "/assets/endless/js/endless/endless",
     "parsley": "/assets/endless/js/parsley.min.zh_cn",
     "gritter": "/assets/endless/js/jquery.gritter.min",
     "init": "/assets/javascripts/sanyi-init",
     "main": "/assets/javascripts/main",
     "ocLazyLoad": "/assets/javascripts/angular/ocLazyLoad.min",
     "ocLazyLoad.require": "/assets/javascripts/angular/ocLazyLoad.require.min",
     "angular": "/assets/javascripts/angular/angular.min",
     "uiRouter": "/assets/javascripts/angular/angular-ui-router",
     "ngRouter": "/assets/javascripts/angular/angular-route.min",
     "ngRequire": "/assets/javascripts/angular/angular-require.min",
     "asyncLoader": "/assets/javascripts/angular/angular-async-loader.min",
     "angularFileUpload": "/assets/javascripts/angular/angular-file-upload.min",
     "ngTagsInput": "/assets/javascripts/ng-tags-input/ng-tags-input",
     "ractive": "/assets/javascripts/ractive/ractive.min",
     "ractiveHover": "/assets/javascripts/ractive/ractive-events-hover",
     "ractiveKeys": "/assets/javascripts/ractive/ractive-events-keys",
     "ractiveTap": "/assets/javascripts/ractive/ractive-events-tap",
     "ractiveFade": "/assets/javascripts/ractive/ractive-transitions-fade",
     "ractivePackage": "/assets/javascripts/ractive/ractive-transitions-fade",
     "app": "/assets/javascripts/app/define",
     "shop": "/assets/javascripts/app/shop/homeController",
     "shopApp": "/assets/javascripts/app/shop/app",
     "shopConfig": "/assets/javascripts/app/shop/shop_config",
     "hasPaymentApp": "/assets/javascripts/app/shop/hasPayment",
     "priceApp": "/assets/javascripts/app/price/app",
     "priceGoodsType": "/assets/javascripts/app/price/goodsType",
     "plupload": "/assets/javascripts/plupload.full.min",
     "promotionApp": '/assets/javascripts/app/promotion/app',
     "promotionDirectives": "/assets/javascripts/app/promotion/directives",
     "promotionServices": "/assets/javascripts/app/promotion/services",
     "promotionControllers": "/assets/javascripts/app/promotion/controllers",
     "memberData": "/assets/javascripts/app/member/memberData",
     "memberApp": "/assets/javascripts/app/member/app",
     "directive.page": "/assets/javascripts/app/member/directive/directive.page",
     "directive.datepicker": "/assets/javascripts/app/member/directive/directive.datepicker",
     "memberTypeApp": "/assets/javascripts/app/member/app",
     "memberType": "/assets/javascripts/app/member/memberType",
     "memberAccount": "/assets/javascripts/app/member/memberAccount",
     "memberAdd": "/assets/javascripts/app/member/memberAdd",
     "systemApp":"/assets/javascripts/app/system/app",
     "page": "/assets/templates/memberapp/myDirective/page",
     "goodsTypePrint": "/assets/javascripts/app/shop/goodsTypePrint",
     "tool": "/assets/javascripts/tool/tool",
     "grayscale": "/assets/javascripts/tool/grayscale",
     "colorbox": "/assets/javascripts/tool/jquery.colorbox.min",
   },
   shim: {
     "bootstrap": {
       deps: ["jquery"]
     },
     "colorbox": {
       deps: ["jquery"]
     },
     "momentWithLangs": {
       deps: ["jquery", "bootstrap"],
       exports: "moment"
     },
     "moment": {
       deps: ["jquery", "bootstrap"]
     },
     "datetimepicker": {
       deps: ["jquery", "momentWithLangs"]
     },
     "popupoverlay": {
       deps: ["jquery", "bootstrap"]
     },
     "gritter": {
       deps: ["jquery"]
     },
     /*"slimscroll": {
       deps: ["jquery", "bootstrap"]
     },*/
     "endless": {
       deps: ["jquery", "bootstrap", "modernizr"]
     },
     "parsley": {
       deps: ["jquery", "bootstrap"]
     },
     "stickUp": {
       deps: ["jquery", "bootstrap"]
     },
     "init": {
       deps: ["jquery", "bootstrap"]
     },
     "main": {
       deps: ["jquery", "bootstrap"]
     },
     "angular": {
       deps: ["jquery"]
     },
     "ocLazyLoad": {
       deps: ["angular"]
     },
     "ocLazyLoad.require": {
       deps: ["angular"]
     },
     "asyncLoader": {
       deps: ["angular"],
       exports: "asyncLoader"
     },
     "uiRouter": {
       deps: ["angular"]
     },
     "ngRouter": {
       deps: ["angular"]
     },
     "ngRequire": {
       deps: ["angular"]
     },
     "angularFileUpload": {
       deps: ["angular", "uiRouter"]
     },
     "ngTagsInput": {
       deps: ["angular"]
     },
     "jquery": {
       exports: "jQuery"
     },
     "app": {
       exports: "app"
     },
     "ractive": {
       deps: ["angular", "uiRouter"]
     },
     "ractiveHover": {
       deps: ["ractive"]
     },
     "ractiveKeys": {
       deps: ["ractive"]
     },
     "ractiveTap": {
       deps: ["ractive"]
     },
     "ractiveFade": {
       deps: ["ractive"]
     },
     "ractivePackage": {
       deps: ["ractive","ractiveHover","ractiveKeys","ractiveTap"]
     },

     "cockpit": {
       deps: ["echarts"]
     },
     "promotionApp": {
       exports: "promotionApp"
     },
     "memberTypeApp": {
       exports: "memberTypeApp"
     }
   },
   waitSeconds: 0
     //超时设置为0
 })
