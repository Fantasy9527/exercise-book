define(["memberApp","datetimepicker", "tool"],function(app){
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
app.controller('dataController', ['$scope', "$http", "$location","$state", function($scope, $http, $location,$state) {
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

}])
})
