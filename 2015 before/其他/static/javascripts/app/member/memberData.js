define(["angular","uiRouter", "tool"],function(){
  var app = angular.module('sanyiapp', ['ui.router']);
  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/memberData/' + brandId);
    $stateProvider
        .state('/memberData/:brandId', {
            url: '/memberData/:brandId',
            templateUrl: '/assets/templates/memberapp/memberData.html',
            controller: 'memberDataController'
        })
        .state('/memberDetail', {
            url: '/memberDetail/:memberId',
            templateUrl: '/assets/templates/memberapp/memberDetail.html',
            controller: 'memberDetailController'
        })
        .state('/expenseRecord', {
            url: '/expenseRecord/:memberId',
            templateUrl: '/assets/templates/memberapp/expenseRecord.html',
            controller: 'expenseRecordController'
        })
        .state('/chargeRecord', {
            url: '/chargeRecord/:memberId',
            templateUrl: '/assets/templates/memberapp/chargeRecord.html',
            controller: 'chargeRecordController'
        })
        .state('/hanginAccount', {
            url: '/hanginAccount/:memberId',
            templateUrl: '/assets/templates/memberapp/hanginAccount.html',
            controller: 'hanginAccountController'
        })
        .state('/putUpRecord', {
            url: '/putUpRecord/:memberId',
            templateUrl: '/assets/templates/memberapp/putUpRecord.html',
            controller: 'putUpRecordController'
        })

});
app.run(function($rootScope) {
    $rootScope.currentMember = {};
})
app.directive('datepicker', function() {
    return function(scope, element, attrs) {
        element.datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        }).on('changeDate', function(dateText) {
            var date = element[0].value;
            var modelPath = $(this).attr('ng-model');
            scope.bindToAddingModel(modelPath, date);
            scope.$apply();

        })
    }
})
app.controller('memberDataController', ['$scope', "$http", "$location", function($scope, $http, $location) {
    var params = {
        memberType: null,
        begin: null,
        end: null,
        state: 1, //0 停用  正常
        page: 0,
        pageSize: 30,
        filter: null
    }
if ($location.search().page || $location.search() == 0) {
        params = $location.search()
    } else {
        params = {
            memberType: null,
            begin: null,
            end: null,
            state: 1, //0 停用  正常
            page: 0,
            pageSize: 30,
            filter: null
        }
        $location.search(params)
    }
    getBase()
    getData()

    function getBase() {
        $http.get("/home/brand/" + brandId + "/member/base").success(function(res) {
            $scope.memberState = [{
                name: "所有",
                id: null,
                sel: false
            }, {
                name: "正常",
                id: 1,
                sel: false
            }, {
                name: "停用",
                id: 2,
                sel: false
            }]

            var allMamberType = {
                name: "所有",
                id: null
            }

            var allTime = {
                name: "不限",
                id: null
            }

            $scope.points = [{
                id: -1,
                name: "不限",
                begin: undefined,
                end: undefined,
                sel: true
            }, {
                id: 1,
                name: "0-500",
                begin: 0,
                end: 500,
                sel: false
            }, {
                id: 2,
                name: "500-1000",
                begin: 500,
                end: 1000,
                sel: false
            }, {
                id: 3,
                name: "1000-2000",
                begin: 1000,
                end: 2000,
                sel: false
            }, {
                id: 4,
                name: "2000-5000",
                begin: 2000,
                end: 5000,
                sel: false
            }, {
                id: 5,
                name: "5000以上",
                begin: 5000,
                end: undefined,
                sel: false
            }, {
                id: 0,
                name: "自定义",
                begin: undefined,
                end: undefined,
                sel: false
            }]

            $scope.consumes = [{
                id: -1,
                name: "不限",
                sel: true
            }, {
                id: 1,
                name: "1-3次",
                begin: 1,
                end: 3,
                sel: false
            }, {
                id: 2,
                name: "4-5次",
                begin: 4,
                end: 5,
                sel: false
            }, {
                id: 3,
                name: "6次及以上",
                begin: 6,
                end: undefined,
                sel: false
            }, {
                id: 0,
                name: "自定义",
                begin: undefined,
                end: undefined,
                sel: false
            }]

            //默认选择会员状态
            $scope.memberState.forEach(function(io) {
                if (io.id == params.state) {
                    io.sel = true
                } else {
                    io.sel = false
                }
            })
            res.memberTypes.unshift(allMamberType)
            res.dateSpans.unshift(allTime)
            //默认选择会员类型
            res.memberTypes.forEach(function(io) {
                if (io.id == params.memberType) {
                    io.sel = true
                } else {
                    io.sel = false
                }
            })
            //默认选择日期
            var isNotDaySpan = true
            //如果没有任何日期匹配
            res.dateSpans.forEach(function(io) {
                if (io.begin == params.begin && io.end == params.end) {
                    io.sel = true
                    isNotDaySpan = false
                    res.dateSpans[res.dateSpans.length - 1].sel = false
                } else {
                    io.sel = false
                }
            });
            if (isNotDaySpan) {
                alert()
                if (params.begin != null) {
                    res.dateSpans[res.dateSpans.length - 1].name = params.begin + " ~ " + params.end
                    res.dateSpans[res.dateSpans.length - 1].sel = true
                } else {
                    res.dateSpans[0].sel = true
                }
            }
            $scope.base = res
        })
    }

    $scope.selMemberType = function(obj) {
        $scope.base.memberTypes.forEach(function(io) {
            io.sel = false
        })
        obj.sel = true
        params.memberType = obj.id
        params.page=0
        getData()
    }

    $scope.selState = function(obj) {
        $scope.memberState.forEach(function(io) {
            io.sel = false
        });
        obj.sel = true
        params.state = obj.id
        params.page=0
        getData()
    }

    $scope.otherTime = false
    $scope.selTime = function(obj) {
        $scope.otherTime = false
        $scope.base.dateSpans.forEach(function(io) {
            io.sel = false
        })
        obj.sel = true
        if (obj.id == 0) {
            $scope.otherTime = true
        } else {
            params.page=0
            params.begin = obj.begin
            params.end = obj.end
            getData()
        }
    }

    $scope.selectPoint = function(point){
        $scope.points.forEach(function(p){
            p.sel = false
        })
        point.sel = true
        $scope.otherConsume = false
        if(point.id == 0){
            $scope.otherPoint = true
        } else {
            $scope.otherPoint = false
            params.pointBegin = point.begin
            params.pointEnd = point.end
            getData()
        }
    }

    $scope.commitPoint = function(){
        var content = ""
        if($scope.pointBegin == undefined || $scope.pointBegin <= 0 || $scope.pointBegin.length == 0){$scope.pointBegin = undefined}
        if($scope.pointEnd == undefined || $scope.pointEnd <= 0 || $scope.pointEnd.length == 0){$scope.pointEnd = undefined}
        if ($scope.pointBegin != undefined){
            content = $scope.pointBegin
        }
        if($scope.pointBegin != undefined && $scope.pointEnd != undefined){
            content = content + ","
        }
        if ($scope.pointEnd != undefined){
            content = content + $scope.pointEnd
        }
        if($scope.pointBegin == undefined && $scope.pointEnd == undefined){
            $scope.points[0].sel = true
            $scope.points[6].sel = false
        } else {
            $scope.points[6].name = "[" + content + "]"
        }
        if($scope.pointBegin == undefined && $scope.pointEnd != undefined){
            $scope.points[6].name = "小于等于" + $scope.pointEnd + ""
        }
        if($scope.pointBegin != undefined && $scope.pointEnd == undefined){
            $scope.points[6].name = "大于等于" + $scope.pointBegin + ""
        }
        $scope.otherPoint = false
        params.pointBegin = $scope.pointBegin
        params.pointEnd = $scope.pointEnd
        getData()
    }

    $scope.selectConsume = function(consume){
        $scope.consumes.forEach(function(s){
            s.sel = false
        })
        consume.sel = true
        $scope.otherPoint = false
        if(consume.id == 0){
            $scope.otherConsume = true
        } else {
            $scope.otherConsume = false
            params.consumeBegin = consume.begin
            params.consumeEnd = consume.end
            getData()
        }
    }

    $scope.commitConsume = function(){
        var content = ""
        if($scope.consumeBegin == undefined || $scope.consumeBegin <= 0 || $scope.consumeBegin.length == 0){$scope.consumeBegin = undefined}
        if($scope.consumeEnd == undefined || $scope.consumeEnd <= 0 || $scope.consumeEnd.length == 0){$scope.consumeEnd = undefined}
        if ($scope.consumeBegin != undefined){
            content = $scope.consumeBegin
        }
        if($scope.consumeBegin != undefined && $scope.consumeEnd != undefined){
            content = content + "~"
        }
        if ($scope.consumeEnd != undefined){
            content = content + $scope.consumeEnd
        }
        if($scope.consumeBegin == undefined && $scope.consumeEnd == undefined){
            $scope.consumes[0].sel = true
            $scope.consumes[4].sel = false
        } else {
            $scope.consumes[4].name = "[" + content + "]"
        }
        if($scope.consumeBegin == undefined && $scope.consumeEnd != undefined){
            $scope.consumes[4].name = "小于等于" + $scope.consumeEnd + ""
        }
        if($scope.consumeBegin != undefined && $scope.consumeEnd == undefined){
            $scope.consumes[4].name = "大于等于" + $scope.consumeBegin + ""
        }
        $scope.otherConsume = false
        params.consumeBegin = $scope.consumeBegin
        params.consumeEnd = $scope.consumeEnd
        getData()
    }

    $scope.search = function(e) {
        params.filter = $scope.searchData
        params.page=0
        getData()
    }

    $scope.enterSearch=function(e){
        if(e.keyCode==13){
             $scope.search()
        }
    }
    $('#beginTime').datetimepicker()
    $('#endTime').datetimepicker()
    $scope.setOtherTime = function() {
        $scope.otherTime = false
        if (!$scope.otherBegin || !$scope.otherEnd) {
            alert("时间不能为空")
            $scope.base.dateSpans.forEach(function(obj) {
                obj.sel = false
                if (obj.id == indexTimeId) {
                    obj.sel = true
                }
            })
        } else {
            params.begin = $scope.otherBegin
            params.end = $scope.otherEnd
            params.page = 0
            getData()
            $scope.base.dateSpans[$scope.base.dateSpans.length - 1].name = params.begin + " 至 " + params.end
        }

    }

    function getData() {
        $location.search(params)
        $http.get("/home/brand/" + brandId + "/members", {
            params: params
        }).success(function(res) {
            res.models.forEach(function(io, index) {
                io.No = index + 1 + (res.pages.current * params.pageSize)
            })
            $scope.models = res.models
            for (var i = 0; i < res.pages.showing.length; i++) {
                if (res.pages.showing[i] == null) {
                    res.pages.showing[i] = {
                        name: "..."
                    }
                } else {
                    res.pages.showing[i] = {
                        name: res.pages.showing[i] + 1
                    }
                }
            }
            $scope.pageModel = res.pages
            $scope.pageShowing = res.pages.showing
        })
    }

    //下一页
    $scope.pageNext = function(num) {
        params.page = num
        getData()
    }

    //上一页
    $scope.pagePrevious = function(num) {
        params.page = num
        getData()
    }
    //跳到当前页面
    $scope.indexPage = function(num) {
        if (num != "...") {
            params.page = num - 1
            getData()
        }
    }

    $scope.skipToDetail = function(memberTypeId, memberId) {
        var href = '#/memberDetail/' + memberId
        window.location.href = href
    }
}])

/*会员基本信息controller*/
app.controller('memberDetailController', function($scope, $http, $stateParams, $timeout, $location, $anchorScroll) {
    /*设置页面名称*/
    $scope.currentMember.pageName = "会员资料";
    $scope.bindToAddingModel = function(val, value) {
        eval("$scope." + val + "='" + value + "'");
    }
    /*设置当前bread显示*/
    $scope.cardState = -1;
    $scope.memberId = $stateParams.memberId;
    /*拼接获取会员详细信息的url*/
    var getMemberDetailUrl = '/home/brand/' + brandId + '/member/' + $stateParams.memberId;
    /*获取会员的详细信息*/
    $http.get(getMemberDetailUrl).success(function(data) {
        $scope.model = data.member.member;
        $scope.model.memberType = data.member.member_type.id;
        $scope.model.memberTypeName = data.member.member_type.name;
        data.staffs.forEach(function(staff) {
            if (staff.id == $scope.model.sale_staff) {
                $scope.model.sale_staff = staff.name;
            }
        })
        $scope.model.card_no = data.card.card_no
        $scope.model.rfid = data.card.rfid
        $scope.model.total_balance = formatPrice($scope.model.charge_balance + $scope.model.gift_balance);
        $scope.model.create_on = $scope.model.create_on.substr(0, 10);
        data.identTypes.forEach(function(identType) {
            if (identType.id == $scope.model.id_type) {
                $scope.model.identType = identType.id
                $scope.model.identTypeName = identType.name
            }
        })
        if ($scope.model.sex != '男' && $scope.model.sex != '女') {
            $scope.model.sex = '';
        }
    })
    /*挂失和冻结*/
    $scope.changeMemberState = function(val) {
        if (val == 1) {
            $scope.warnInfo = "再次启用";
        } else if (val == 2) {
            $scope.warnInfo = "停用";
        } else if (val == 192) {
            $scope.warnInfo = "挂失";
        }
        var saveModelUrl = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/save';
        var postModel = JSON.parse(JSON.stringify($scope.model));
        postModel.state = val;
        $http.post(saveModelUrl, postModel).success(function(data) {
            $scope.model.state = data.state;
            $scope.showAlert = 1;
            $timeout(function() {
                $scope.showAlert = -1;
            }, 5000)
        })
    }

    $scope.isEdit = -1;
    $scope.showEditAlert = -1;
    $scope.sexes = ["男", "女"]
    $scope.editMember = function() {
        $scope.isEdit = 1
        getEditMemberBase()
    }
    function getEditMemberBase(){
        $scope.editModel = JSON.parse(JSON.stringify($scope.model))
        var url = '/home/brand/' + brandId + '/member/edit/base'
        $http.get(url).success(function(data){
            $scope.memberTypes = data.memberTypes
            $scope.identTypes = data.identTypes
        })
    }
    $scope.hideEdit = function() {
        $scope.isEdit = -1;
    }
    function packageModel(){
        $scope.memberTypes.forEach(function(memberType){
            if($scope.model.memberType == memberType.id){
                $scope.model.memberTypeName = memberType.name
                return
            }
        })
        $scope.identTypes.forEach(function(identType){
            if($scope.model.identType == identType.id){
                $scope.model.identTypeName = identType.name
                return
            }
        })
    }
    $scope.saveModel = function() {
        var saveModelUrl = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/save';
        $http.post(saveModelUrl, $scope.editModel).success(function(data) {
            $scope.model = JSON.parse(JSON.stringify($scope.editModel))
            packageModel()
            $scope.isEdit = -1;
            $scope.showEditAlert = 1;
            $location.hash('isEditAlert');
            $anchorScroll();
            $timeout(function() {
                $scope.showEditAlert = -1;
            }, 5000)
            $scope.model.name = data.name;
            $scope.model.birthday = data.birthday;
        }).error(function(data){
            alert(data.message)
        })
    }
    $('.datepickerTime').datetimepicker();
    //调整
    $scope.balanceChange = function() {
        $scope.modalOpen = true;
        $scope.giftChangeValue = "";
        $scope.chargeChangeValue = "";
        $scope.pointChangeValue = "";
    }

    $scope.closeModel = function() {
        //余额窗口关闭
        $scope.modalOpen = false;
        //积分窗口关闭
        $scope.pointModalOpen = false;
        //充值窗口还原
        $scope.changeBtnShow = true;
        $scope.changeRemark = "";
    }

    $scope.changeBtnShow = true;
    $scope.isRecharge = false;

    $scope.recharge = function() {
        $scope.changeBtnShow = false;
        $scope.isRecharge = true;
    }

    $scope.withhold = function() {
        $scope.changeBtnShow = false;
        $scope.isRecharge = false;
    }

    $scope.changeBalance = function(s) {
        var json;
      if(($scope.chargeChangeValue===""&&$scope.giftChangeValue==="")||($scope.chargeChangeValue==0&&$scope.giftChangeValue==0)){
        alert("请在需要调整的账户输入调整金额");
        return
      }

        if (s == "isChargeChange") {
            json = {
                "charge": isRecharge($scope.chargeChangeValue)==""?0:isRecharge($scope.chargeChangeValue),
                "gift": isRecharge($scope.giftChangeValue)==""?0:isRecharge($scope.giftChangeValue),
                "point": 0,
                "remark": $scope.changeRemark
            }
        } else {
            json = {
                "charge": 0,
                "gift": 0,
                "point": isRecharge($scope.pointChangeValue)==""?0:isRecharge($scope.pointChangeValue),
                "remark": $scope.changeRemark
            }
            if(json.point==0){
              alert("请输入有意义的调整数字");
              return
            }
        }

        function isRecharge(e) {
            if ($scope.isRecharge) {
                return e
            } else {
                return -e
            }
        }
        if($.trim(json.remark)==""){
            alert("备注不能为空");
            return
        }

        if(json.remark.length>100){
            alert("备注不能超过100个字");
            return
        }

        $http.post("/home/brand/" + brandId + "/member/balance/" + $stateParams.memberId, json).success(function(res) {
            $scope.model.charge_balance = res.charge_balance;
            $scope.model.gift_balance = res.gift_balance;
            $scope.model.point = res.point;
            $scope.closeModel()
        }).error(function(res) {
            alert(res.message)
        })
    }
    //积分调整
    $scope.pointOpen = function() {
        $scope.modalOpen = false;
        $scope.pointModalOpen = true;
    }
})

/*会员消费记录controller*/
app.controller('expenseRecordController', function($scope, $http, $stateParams) {
    $scope.currentMember.pageName = "消费记录";
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

/*会员充值记录controller*/
app.controller('chargeRecordController', function($scope, $http, $stateParams) {
        $scope.memberId = $stateParams.memberId;
        $scope.currentMember.pageName = "充值记录";
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
    /*会员挂账记录controller*/
app.controller('hanginAccountController', function($scope, $http, $stateParams) {
        $scope.memberId = $stateParams.memberId;
        $scope.currentMember.pageName = "挂账结算";
        $scope.showDetail = -1;

        var getRecord = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/expend/records?member=' + $scope.memberId + '&begin=' + '1914-01-01' + '&page=0';
        $http.get(getRecord).success(function(data) {
            $scope.models = data.stats;
            $scope.pageSize = data.pages.pageSize;
            $scope.page = data.pages.current + 1;
            $scope.recordCount = data.pages.total;
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
        $scope.searchMembers = function() {
            $scope.page = $scope.shareObject.currentPage;
            $scope.cutRecord();
        }
    })
    /*会员挂单记录controller*/
app.controller('putUpRecordController', function($scope, $http, $stateParams) {
    $scope.memberId = $stateParams.memberId;
    $scope.currentMember.pageName = "挂单记录";
    $scope.showDetail = -1;

    var getRecord = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/expend/records?member=' + $scope.memberId + '&begin=' + '1914-01-01' + '&page=0';
    $http.get(getRecord).success(function(data) {
        $scope.models = data.stats;
        $scope.pageSize = data.pages.pageSize;
        $scope.page = data.pages.current + 1;
        $scope.recordCount = data.pages.total;
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
    $scope.searchMembers = function() {
        $scope.page = $scope.shareObject.currentPage;
        $scope.cutRecord();
    }
})

})
