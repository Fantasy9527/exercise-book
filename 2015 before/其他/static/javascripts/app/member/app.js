define(["asyncLoader", "angular", "uiRouter", "angularFileUpload"], function(asyncLoader) {
    var app = angular.module('sanyiapp', ['ui.router', "angularFileUpload"]);
    asyncLoader.configure(app);
    app.run(function($rootScope) {
        $rootScope.brandId = brandId;
        $rootScope.$on("$stateChangeSuccess", function(angularEvent, current, previous) {
            document.title = current.title;
            $rootScope.currentTitle = current.title
        });
    })
    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/member').when("", "/member");
        $stateProvider
            .state('member', {
                url: '/member',
                title: "会员管理",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/home.html',
                        //controller: 'systemController',
                        //  controllerUrl: '/assets/javascripts/app/member/memberController.js'
                    }
                }
            })
            .state('member.data', {
                url: '/data',
                title: "会员资料",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/data/data.html',
                        controller: 'dataController',
                        controllerUrl: '/assets/javascripts/app/member/data/dataController.js'
                    }
                }
            })
            .state('member.data.detail', {
                url: '/detail/:memberId',
                title: "会员详情",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/data/detail.html',
                        controller: 'detailController',
                        controllerUrl: '/assets/javascripts/app/member/data/detailController.js'
                    }
                }
            })
            .state('member.data.expenseRecord', {
                url: '/expenseRecord/:memberId',
                title: "消费记录",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/data/expenseRecord.html',
                        controller: 'expenseRecordController',
                        controllerUrl: '/assets/javascripts/app/member/data/expenseRecordController.js'
                    }
                }
            })
            .state('member.data.chargeRecord', {
                url: '/chargeRecord/:memberId',
                title: "充值记录",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/data/chargeRecord.html',
                        controller: 'chargeRecordController',
                        controllerUrl: '/assets/javascripts/app/member/data/chargeRecordController.js'
                    }
                }
            })
            .state('member.data.hanginAccount', {
                url: '/hanginAccount/:memberId',
                title: "挂账结算",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/data/hanginAccount.html',
                        controller: 'hanginAccountController',
                        controllerUrl: '/assets/javascripts/app/member/data/hanginAccountController.js'
                    }
                }
            })
            .state('member.data.putUpRecord', {
                url: '/putUpRecord/:memberId',
                title: "挂单记录",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/data/putUpRecord.html',
                        controller: 'putUpRecordController',
                        controllerUrl: '/assets/javascripts/app/member/data/putUpRecordController.js'
                    }
                }
            })


        //会员类型
        .state('member.type', {
                url: '/type',
                title: "类型资料",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/type/memberType.html',
                        controller: 'memberTypeController',
                        controllerUrl: '/assets/javascripts/app/member/type/memberTypeController.js'
                    }
                }
            })
            .state('member.addMemberType', {
                url: '/add',
                title: "类型资料",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/type/addMemberType.html',
                        controller: 'addMemberTypeController',
                        controllerUrl: '/assets/javascripts/app/member/type/addMemberTypeController.js'
                    }
                }
            })
            .state('member.type.detail', {
                url: '/detail/:id',
                title: "类型资料详情",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/type/memberDetail.html',
                        controller: 'memberDetailController',
                        controllerUrl: '/assets/javascripts/app/member/type/memberDetailController.js'
                    }
                }
            })
            .state('member.type.balanceState', {
                url: '/balanceState/:id',
                title: "类型资料详情",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/type/balanceState.html',
                        controller: 'balanceStateController',
                        controllerUrl: '/assets/javascripts/app/member/type/balanceStateController.js'
                    }
                }
            })

        //流水
        .state('member.accountCharges', {
                url: '/account/charges',
                title: "充值流水",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/account/accountCharges.html',
                        controller: 'accountChargesController',
                        controllerUrl: '/assets/javascripts/app/member/account/accountChargesController.js'
                    }
                }
            })
        .state('member.accountConsumes', {
                url: '/account/consumes',
                title: "消费流水",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/account/accountConsumes.html',
                        controller: 'accountConsumesController',
                        controllerUrl: '/assets/javascripts/app/member/account/accountConsumesController.js'
                    }
                }
            })
        .state('member.checkBalance', {
                url: '/account/checkBalance',
                title: "调账流水",
                views: {
                    "": {
                        templateUrl: '/assets/templates/member/main.html',
                    },
                    "main@member": {
                        templateUrl: '/assets/templates/member/account/checkBalance.html',
                        controller: 'checkBalanceController',
                        controllerUrl: '/assets/javascripts/app/member/account/checkBalanceController.js'
                    }
                }
            })

    });
    return app
})
