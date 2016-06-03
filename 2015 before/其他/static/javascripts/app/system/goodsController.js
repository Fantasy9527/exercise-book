define(["systemApp"], function(app) {
    app.controller("goodsController", ["$scope", "$http", "$location", "FileUploader","$state", function($scope, $http, $location, FileUploader,$state) {
        var params;
        $(".goodsMain").css({
            "visibility": "visible"
        })
        if ($location.search().page || $location.search() == 0) {
            params = $location.search();
        } else {
            params = {
                group: -1,
                subgroup: -1,
                page: 0,
                pageSize: 20,
                query: ""
            };
            $location.search(params);
        }

        $scope.searchData = params.query;
        $scope.pageData = [{
            name: "20条",
            size: 20
        }, {
            name: "50条",
            size: 50
        }, {
            name: "100条",
            size: 100
        }, {
            name: "200条",
            size: 200
        }, {
            name: "500条",
            size: 500
        }, {
            name: "1000条",
            size: 1000
        }, ];
        $scope.pageSize = parseInt(params.pageSize);
        $scope.pageChange = function() {
            params.pageSize = $scope.pageSize;
            params.page = 0;
            $scope.isLoding = true;
            getGoods();
        }

        $scope.isLoding = true;
        var subGroupsData,
            GroupsData,
            productTypes,
            goodsMethods,
            unitTypes,
            allUnitTypes,
            newGood;
        $http.get("/home/brand/" + brandId + "/goodsType/groups").success(function(res) {
            unitTypes = res.unitTypes;
            allUnitTypes = angular.copy(res.unitTypes);
            allUnitTypes.forEach(function(io) {
                io.sel = false;
            });
            //console.log(res)
            GroupsData = angular.copy(res.groups);
            subGroupsData = angular.copy(res.subgroups);
            productTypes = res.productTypes;
            goodsMethods = res.goodsMethods;
            productTypes.forEach(function(io) {
                io.sel = false;
            });
            unitTypes.forEach(function(io) {
                io.sel = false;
                io.productTypes = angular.copy(productTypes);
            });
            goodsMethods.forEach(function(io) {
                io.sel = false;
            });
            var allGroup = {
                id: -1,
                name: "所有",
                productType: -1,
                goodsCount: 0,
                sel: true
            };
            var allsubgroups = {
                id: -1,
                name: "所有",
                productType: -1,
                goodsCount: 0,
                sel: true
            };

            res.groups.forEach(function(group) {
                group.sel = false;
                allGroup.goodsCount += group.goodsCount;
            });
            res.groups.unshift(allGroup);
            res.subgroups.unshift(allsubgroups);
            $scope.groups = res.groups;
            $scope.subgroups = res.subgroups;

            $scope.groups.forEach(function(io) {

                if (io.id == params.group) {
                    io.sel = true;
                } else {
                    io.sel = false;
                }
            });
            $scope.subgroups.forEach(function(io) {

                if (io.group == params.group) {
                    io.show = true;
                } else {
                    io.show = false;
                }

                if (io.id == params.subgroup) {
                    io.sel = true;
                } else {
                    io.sel = false;
                }
            })
            getGoods();
        });

        $scope.search = function(e) {
            params.query = $scope.searchData
            params.page = 0
            getGoods()
        }

        $scope.enterSearch = function(e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        }


        //获取数据
        function getGoods(hasAdd) {
            $location.search(params);
            $http.get("/home/brand/" + brandId + "/goodsTypes", {
                params: params
            }).success(function(res) {
                $scope.goods = res.goodsTypes;
                $scope.goodsMethods = angular.copy(goodsMethods);
                $scope.unitTypes = angular.copy(allUnitTypes);

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

                res.goodsTypes.forEach(function(io) {
                    io.productType = io.unitTypes[0].productType;
                    if (io.image56_56 == null) {
                        io.image56_56 = io.sourceImage;
                    }

                    io.sel = false;
                    io.edit = false;
                    io.isgoodsMethodsShow = false;
                    io.isUnitTypeShow = false;
                    io.isImageShow = false;
                    io.imageUrl = io.image56_56;


                })


                $scope.pageShowing = res.pages.showing;
                $scope.goodsData = res;
                //console.log(res.goodsTypes)
                //console.log($scope.goodsData);
                $scope.isLoding = false;

                if (hasAdd) {
                    newGood = {
                        name: "",
                        group: hasAddGroup(),
                        subgroup: hasAddsubgroup(),
                        remark: "",
                        edit: true,
                        add: true,
                        sel: false,
                        allGroups: angular.copy(GroupsData),
                        allSubGroups: angular.copy(subGroupsData),
                        subGroups: returnAddSubGroups(),
                        goodsMethods: angular.copy(goodsMethods),
                        allUnitTypes: angular.copy(allUnitTypes),
                        allProductTypes: angular.copy(productTypes),
                        isgoodsMethodsShow: false,
                        isUnitTypeShow: false,
                        isImageShow: false,
                        productType: angular.copy(productTypes)[0].id,
                        unitTypes: [],
                        imageUrl: null,
                        image56_56: null
                    }

                    var productType;
                    for (var i = 0; i < newGood.allGroups.length; i++) {
                        if (newGood.allGroups[i].id == newGood.group) {
                            productType = newGood.allGroups[i].productType;
                        }
                    }
                    if (productType == 6) {
                        newGood.productType = 6;
                        newGood.proDis = true;
                    } else {
                        newGood.proDis = false;
                    }

                    //console.log(newGood)
                    $scope.goods.unshift(newGood);

                }

            });
        }


        function hasAddGroup() {
            if (params.group == -1) {
                return angular.copy(GroupsData)[0].id
            } else {
                return parseInt(params.group);
            }
        }


        function hasAddsubgroup() {
            var tamp_subgroup = angular.copy(subGroupsData);
            var arr = [];
            if (params.group == -1) {
                //如果选择了所有
                tamp_subgroup.forEach(function(io) {
                    if (io.group == angular.copy(GroupsData)[0].id) {
                        arr.push(io)
                    }
                })
                return arr[0].id;
            } else {
                if (params.subgroup == null) {
                    tamp_subgroup.forEach(function(io) {
                        if (io.group == params.group) {
                            arr.push(io)
                        }
                    })
                    return arr[0].id;
                } else {
                    return parseInt(params.subgroup);
                }
            }

        }

        function returnAddSubGroups() {
            var tamp_subgroup = angular.copy(subGroupsData);
            var arr = [];
            if (params.group == -1) {
                //如果选择了所有
                tamp_subgroup.forEach(function(io) {
                    if (io.group == angular.copy(GroupsData)[0].id) {
                        arr.push(io)
                    }
                })
            } else {
                tamp_subgroup.forEach(function(io) {
                    if (io.group == params.group) {
                        arr.push(io)
                    }
                })
            }
            return arr;
        }



        //添加菜品
        $scope.addGood = function() {
            for (var i = 0; i < $scope.goods.length; i++) {
                if ($scope.goods[i].add) {
                    return
                }
            }
            //还原恢复状态
            $scope.goods.forEach(function(io, index) {
                if (io.edit) {
                    $scope.goods[index] = tempGoodData;
                }
                io.edit = false;
            })


            newGood = {
                name: "",
                group: hasAddGroup(),
                subgroup: hasAddsubgroup(),
                remark: "",
                edit: true,
                add: true,
                sel: false,
                allGroups: angular.copy(GroupsData),
                allSubGroups: angular.copy(subGroupsData),
                subGroups: returnAddSubGroups(),
                goodsMethods: angular.copy(goodsMethods),
                allUnitTypes: angular.copy(allUnitTypes),
                allProductTypes: angular.copy(productTypes),
                isgoodsMethodsShow: false,
                isUnitTypeShow: false,
                isImageShow: false,
                productType: angular.copy(productTypes)[0].id,
                unitTypes: [],
                imageUrl: null,
                image56_56: null
            }

            var productType;
            for (var i = 0; i < newGood.allGroups.length; i++) {
                if (newGood.allGroups[i].id == newGood.group) {
                    productType = newGood.allGroups[i].productType;
                }
            }
            if (productType == 6) {
                newGood.productType = 6;
                newGood.proDis = true;
            } else {
                newGood.proDis = false;
            }


            //console.log(newGood)
            $scope.goods.unshift(newGood);

        }


        //筛选大类
        $scope.groupChange = function(group, groupId) {
            var tamp_subgroup = angular.copy(subGroupsData);
            var arr = [];
            var productType;
            tamp_subgroup.forEach(function(io) {
                if (io.group == groupId) {
                    arr.push(io)
                }
            })
            group.groupName = (function() {
                for (var i = 0; i < group.allGroups.length; i++) {
                    if (group.allGroups[i].id == group.group) {
                        productType = group.allGroups[i].productType;
                        return group.allGroups[i].name
                    }
                }
            })();

            if (productType == 6) {
                group.productType = 6;
                group.proDis = true;
            } else {
                group.proDis = false;
            }
            group.subGroups = arr;
            group.subgroup = group.subGroups[0].id;
        }


        function returnSubGroups() {
            var tamp_subgroup = angular.copy(subGroupsData);
            var arr = [];
            tamp_subgroup.forEach(function(io) {
                if (io.group == angular.copy(GroupsData)[0].id) {
                    arr.push(io)
                }
            })
            return arr;
        }
        //选择大类
        $scope.selGroups = function(obj) {
            $scope.subgroups.forEach(function(io) {
                io.sel = false;
                if (io.group == obj.id) {
                    io.show = true;
                } else {
                    io.show = false;
                }
            })

            $scope.groups.forEach(function(io) {
                io.sel = false;
            })
            obj.sel = true;
            params.subgroup = null;
            params.group = obj.id;
            params.page = 0;
            var hasAdd = false;
            if ($scope.goods[0] && !!$scope.goods[0].add) {
                hasAdd = true;
            } else {
                hasAdd = false;
            }
            getGoods(hasAdd);
        }

        //选择小类
        $scope.selSubGroups = function(obj) {
            $scope.subgroups.forEach(function(io) {
                io.sel = false;
            })
            obj.sel = true;
            params.subgroup = obj.id;
            params.page = 0;
            var hasAdd = false;
            if ($scope.goods[0] && !!$scope.goods[0].add) {
                hasAdd = true;
            } else {
                hasAdd = false;
            }
            getGoods(hasAdd);
        }

        //下一页
        $scope.pageNext = function(num) {
            params.page = num;
            getGoods();
        };

        //上一页
        $scope.pagePrevious = function(num) {
                params.page = num;
                getGoods();
            }
            //跳到当前页面
        $scope.indexPage = function(num) {
            if (num != "...") {
                params.page = num - 1;
                getGoods();
            }
        }
        $scope.selAllInput = false;
        $scope.chkAll = function() {
            $scope.selAllInput = !$scope.selAllInput;
            $scope.batchMethod = $scope.selAllInput;
            $scope.goods.forEach(function(io) {
                io.sel = $scope.selAllInput;
                //console.log($scope.selAllInput)
            })
        }

        $scope.check = function(e) {
            e.stopPropagation()
            var num = 0;
            $scope.goods.forEach(function(io) {
                if (io.sel) {
                    num++
                }
            })
            if (num >= 1) {
                $scope.batchMethod = true;
            } else {
                $scope.batchMethod = false;
            }
        }


            //*****************************
            //批量设置
        $scope.bathSetMethod = function() {
            var data = {
                goodsTypes: (function() {
                    var arr = [];
                    $scope.goods.forEach(function(io) {
                        if (io.sel) {
                            arr.push(io.id)
                        }
                    })
                    return arr;
                })(),
                goodsMethods: (function() {
                    var arr = [];
                    var allArr = [];
                    $scope.goodsMethods.forEach(function(io) {
                        if (io.sel) {
                            arr.push(io.id);
                            allArr.push(io)
                        }
                    })

                    $scope.goods.forEach(function(io) {
                        if (io.sel) {
                            io.unitTypes.forEach(function(unitType) {
                                //unitType.goodsMethods = allArr;
                                allArr.forEach(function(a) {
                                    //假设没有重复
                                    var isRepeat = false;
                                    for (var i = 0; i < unitType.goodsMethods.length; i++) {
                                        if (unitType.goodsMethods[i].id == a.id) {
                                            //有重复停止本次循环
                                            isRepeat = true;
                                            break;
                                        }
                                    };
                                    if (!isRepeat) {
                                        //没有重复,添加
                                        unitType.goodsMethods.push(a)
                                    }
                                })
                            })

                            //给下拉框打勾, 因为编辑的时候有这一步操作,所以暂时注释掉
                            /* io.goodsMethods.forEach(function(goodsMethod) {
                                 goodsMethod.sel = false;
                                 arr.forEach(function(a) {
                                     if (goodsMethod.id == a) {
                                         goodsMethod.sel = true;
                                     }
                                 })
                             })*/
                        }
                    })
                    return arr;
                })()
            };
            $http.post("/home/brand/" + brandId + "/goodsType/batch/methods", data).success(function(res) {
                $scope.isBatchgoodsMethodsShow = false;
                //console.log(res);
            })
        }

        //***********************************************************
        //批量设置规格
        $scope.BathSetUnitType = function() {
            var data = {
                goodsTypes: (function() {
                    var arr = [];
                    $scope.goods.forEach(function(io) {
                        if (io.sel) {
                            arr.push(io.id)
                        }
                    })
                    return arr;
                })(),
                unitTypes: (function() {
                    var arr = [];
                    var allArr = [];
                    $scope.unitTypes.forEach(function(io) {
                            if (io.sel) {
                                arr.push(io.id);
                                allArr.push(io)
                            }
                        })
                        //console.log(allArr);
                        //console.log(arr)

                    $scope.goods.forEach(function(io) {
                        if (io.sel) {
                            var temp = angular.copy(io.unitTypes[0]);


                            io.unitTypes.length = 0;
                            allArr.forEach(function(indexArr, index) {
                                    var json = {
                                        goodsMethods: temp.goodsMethods,
                                        productType: temp.productType,
                                        productTypeName: temp.productTypeName,
                                        productTypes: temp.productTypes,
                                        unitType: temp.unitType,
                                        unitTypeName: temp.unitTypeName,
                                        unitTypes: temp.unitTypes
                                    };
                                    json.unitType = indexArr.id;
                                    json.unitTypeName = indexArr.name;
                                    //console.log(json);
                                    io.unitTypes[index] = json;

                                })
                                //console.log(io.unitTypes)
                            io.allUnitTypes.forEach(function(unitType) {
                                unitType.sel = false;
                                arr.forEach(function(a) {
                                    if (unitType.id == a) {
                                        unitType.sel = true;
                                    }
                                })

                            })

                            //console.log(io)
                        }
                    })
                    return arr;
                })()
            };





            $http.post("/home/brand/" + brandId + "/goodsType/batch/unitTypes", data).success(function(res) {
                $scope.isUnitTypeShow = false;
                //console.log(res);
            })

        }

        $scope.batchGoodsMethodsToogle = function(obj) {
                $scope.isBatchgoodsMethodsShow = !$scope.isBatchgoodsMethodsShow;
            }
            //规格toogle
        $scope.isUnitTypeShow = false;
        $scope.batchUnitTypeToogle = function(obj) {
            $scope.isUnitTypeShow = !$scope.isUnitTypeShow;
        }


        //做法toogle
        $scope.goodsMethodsToogle = function(obj) {
                //console.log(obj.isgoodsMethodsShow)
                obj.isgoodsMethodsShow = !obj.isgoodsMethodsShow;
            }
            //单选做法
        $scope.selGoodsMethod = function(obj) {
                obj.sel = !obj.sel;
            }
            //全选做法
        $scope.selGoodsMethodsInput = false;
        $scope.selAllGoodsMethods = function(obj) {
            $scope.selGoodsMethodsInput = !$scope.selGoodsMethodsInput;
            //console.log($scope.selGoodsMethodsInput);
            obj.forEach(function(io) {
                io.sel = $scope.selGoodsMethodsInput;
            })
        }

        $scope.unitTypeToogle = function(obj) {
            obj.isUnitTypeShow = !obj.isUnitTypeShow;
        }

        $scope.selUnitType = function(obj) {
            obj.sel = !obj.sel;
        }

        //编辑
        var tempGoodData;

        $scope.editGoods = function(obj) {
            return
            //console.log(obj)
            if (obj.edit) {
                return
            };
            //如果编辑别的时候,发现新添加的没有保存,删除
            if ($scope.goods[0].add) {
                $scope.goods.splice(0, 1);
            }

            //不以获取数据就全部加载必要数据,编辑的时候再加载
            obj.allGroups = angular.copy(GroupsData);
            obj.allSubGroups = angular.copy(subGroupsData);
            obj.productTypes = angular.copy(productTypes);
            obj.goodsMethods = angular.copy(goodsMethods);
            obj.allUnitTypes = angular.copy(allUnitTypes);
            obj.allProductTypes = angular.copy(productTypes);

            obj.unitTypes.forEach(function(unitType) {
                unitType.productTypes = angular.copy(productTypes);
                unitType.unitTypes = angular.copy(unitTypes);
            })

            obj.subGroups = (function() {
                var arr = [];
                obj.allSubGroups.forEach(function(subgroup) {
                    if (subgroup.group == obj.group) {
                        arr.push(subgroup)
                    }
                })
                return arr;
            })();



            //选中默认做法
            obj.goodsMethods.forEach(function(method) {
                method.sel = false;
                obj.unitTypes[0].goodsMethods.forEach(function(e) {
                    if (e.id == method.id) {
                        method.sel = true;
                    }
                })
            });


            //选中默认规格
            obj.allUnitTypes.forEach(function(allUnitType) {
                obj.unitTypes.forEach(function(unit) {
                    if (unit.unitType == allUnitType.id) {
                        allUnitType.sel = true;
                        //console.log(allUnitType)
                    }
                });
            });



            $scope.goods.forEach(function(io, index) {
                if (io.edit) {
                    $scope.goods[index] = tempGoodData;
                }
                io.edit = false;
                //console.log(io.edit)
            })
            tempGoodData = angular.copy(obj);
            var productType;
            for (var i = 0; i < obj.allGroups.length; i++) {
                if (obj.allGroups[i].id == obj.group) {
                    productType = obj.allGroups[i].productType;
                }
            }
            if (productType == 6) {
                obj.productType = 6;
                obj.proDis = true;
            } else {
                obj.proDis = false;
            }
            obj.edit = true;
            //console.log(obj);
        }


        //取消
        $scope.cancelEidit = function(index) {
                if ($scope.goods[index].add) {
                    $scope.goods.splice(index, 1);
                } else {
                    $scope.goods[index] = tempGoodData;
                    $scope.goods[index].edit = false;
                }
            }
            //删除
        $scope.delData = function(obj, index) {
            if (obj.add) {
                $scope.goods.splice(index, 1);
            } else {
                $http.delete("/home/brand/" + brandId + "/goodsType/" + obj.id + "/remove").success(function() {
                    $scope.goods.splice(index, 1);
                }).error(function(res) {
                    alert(res.message)
                })
            }
        }

        //保存
        $scope.saveData = function(obj, e) {
            e.stopPropagation();
            if (e.type == "click" || e.keyCode == 13) {
                obj.name = $.trim(obj.name);
                if (obj.name == "") {
                    alert("名称不能为空");
                    return
                }
                if (obj.add) {
                    //添加
                    var methodArr = [];
                    var unitArr = [];
                    newGood.tempGoodsMethods = [];
                    newGood.tempUnitTypes = [];
                    //console.log(newGood.goodsMethods);
                    newGood.goodsMethods.forEach(function(method) {
                        if (method.sel) {
                            newGood.tempGoodsMethods.push(method);
                            methodArr.push(method.id);
                        }
                    });

                    newGood.allUnitTypes.forEach(function(io) {
                        if (io.sel) {
                            newGood.tempUnitTypes.push(io);
                            unitArr.push(io.id);
                        }
                    })
                    newGood.unitTypes = [];
                    newGood.tempUnitTypes.forEach(function(io) {
                        newGood.unitTypes.push({
                            unitType: io.id,
                            productType: newGood.productType,
                            goodsMethods: methodArr,
                            productTypes: angular.copy(productTypes),
                            unitTypes: angular.copy(unitTypes)
                        });
                    });

                    newGood.unitTypes.forEach(function(io) {
                        io.goodsMethods = methodArr;
                        io.productTypeName = (function() {
                            for (var i = 0; i < io.productTypes.length; i++) {
                                if (io.productTypes[i].id == io.productType) {
                                    return io.productTypes[i].name;
                                }
                            }
                        })();

                        io.unitTypeName = (function() {
                            for (var i = 0; i < io.unitTypes.length; i++) {
                                if (io.unitTypes[i].id == io.unitType) {
                                    return io.unitTypes[i].name;
                                }
                            }
                        })();
                    })
                    if (obj.unitTypes.length == 0) {
                        alert("您还没有选择规格");
                        return
                    }

                    var newData = angular.copy(newGood);
                    console.log(newData);
                    delete newData.allGroups;
                    delete newData.allProductTypes;
                    delete newData.allSubGroups;
                    delete newData.allUnitTypes;
                    delete newData.goodsMethods;
                    delete newData.subGroups;
                    delete newData.tempGoodsMethods;
                    delete newData.tempUnitTypes;
                    newData.unitTypes.forEach(function(io) {
                        delete io.productTypes
                        delete io.unitTypes
                    })
                    $http.post("/home/brand/" + brandId + "/goodsType/add", newData).success(function(res) {
                        //console.log(res);
                        delete newData;
                        newGood.groupName = (function() {
                            for (var i = 0; i < newGood.allGroups.length; i++) {
                                if (newGood.allGroups[i].id == newGood.group) {
                                    return newGood.allGroups[i].name
                                }
                            }
                        })();
                        newGood.subgroupName = (function() {
                            for (var i = 0; i < newGood.allSubGroups.length; i++) {
                                if (newGood.allSubGroups[i].id == newGood.subgroup) {
                                    return newGood.allSubGroups[i].name
                                }
                            }
                        })();
                        newGood.isgoodsMethodsShow = false;
                        newGood.isUnitTypeShow = false;
                        newGood.unitTypes[0].goodsMethods = newGood.tempGoodsMethods;
                        var addData = angular.copy(newGood);
                        addData.edit = false;
                        addData.add = false;
                        addData.id = res.id;
                        $scope.goods.splice(1, 0, addData);
                        newGood.name = "";
                        newGood.image56_56 = null;
                        newGood.imageUrl = null;
                    }).error(function(res) {
                        //console.log("失败");
                        alert(res.message)
                    })
                } else {
                    //修改
                    //**********************************************
                    obj.groupName = (function() {
                        for (var i = 0; i < obj.allGroups.length; i++) {
                            if (obj.allGroups[i].id == obj.group) {
                                return obj.allGroups[i].name
                            }
                        }
                    })();
                    //console.log(obj.groupName)
                    obj.subgroupName = (function() {
                        for (var i = 0; i < obj.allSubGroups.length; i++) {
                            if (obj.allSubGroups[i].id == obj.subgroup) {
                                return obj.allSubGroups[i].name
                            }
                        }
                    })();

                    var methodArr = [];
                    var unitArr = [];
                    //console.log(obj.goodsMethods);
                    //保存名字信息
                    obj.tempGoodsMethods = [];
                    obj.tempUnitTypes = [];
                    angular.copy(obj.goodsMethods);
                    obj.goodsMethods.forEach(function(method) {
                        if (method.sel) {
                            obj.tempGoodsMethods.push(method);
                            methodArr.push(method.id)
                        }
                    });

                    obj.allUnitTypes.forEach(function(io) {
                            if (io.sel) {
                                obj.tempUnitTypes.push(io);
                                unitArr.push(io.id);
                            }
                        })
                        //console.log(obj.tempUnitTypes)
                        //清空销售方式,用于重新设定
                    obj.unitTypes = [];
                    obj.tempUnitTypes.forEach(function(io) {
                        obj.unitTypes.push({
                            unitType: io.id,
                            productType: obj.productType,
                            goodsMethods: methodArr,
                            productTypes: angular.copy(productTypes),
                            unitTypes: angular.copy(unitTypes)
                        });
                        //console.log(obj.unitTypes)

                    });

                    obj.unitTypes.forEach(function(io) {
                        io.goodsMethods = methodArr;
                        io.productTypeName = (function() {
                            for (var i = 0; i < io.productTypes.length; i++) {
                                if (io.productTypes[i].id == io.productType) {
                                    return io.productTypes[i].name;
                                }
                            }
                        })();

                        io.unitTypeName = (function() {
                            for (var i = 0; i < io.unitTypes.length; i++) {
                                if (io.unitTypes[i].id == io.unitType) {
                                    return io.unitTypes[i].name;
                                }
                            }
                        })();
                    });
                    //console.log(obj);
                    if (obj.unitTypes.length == 0) {
                        alert("您还没有选择规格");
                        return
                    }
                    var editData = angular.copy(obj);
                    //imageUrl为sha,上传的时候,必须改成sha!!!!!!
                    if (!editData.imageIsChange) {
                        editData.imageUrl = obj.image;
                    }
                    //删除不必要上传的信息
                    delete editData.allProductTypes;
                    delete editData.brand;
                    delete editData.edit;
                    delete editData.groupName;
                    delete editData.image56_56;
                    delete editData.image;
                    delete editData.isImageShow;
                    delete editData.isUnitTypeShow;
                    delete editData.isgoodsMethodsShow;
                    delete editData.proDis;
                    delete editData.sel;
                    delete editData.sourceImage;
                    delete editData.allGroups;

                    delete editData.productTypes;
                    delete editData.allSubGroups;
                    delete editData.allUnitTypes;
                    delete editData.goodsMethods;
                    delete editData.subGroups;
                    delete editData.tempGoodsMethods;
                    delete editData.tempUnitTypes;
                    editData.unitTypes.forEach(function(io) {
                        delete io.productTypes
                        delete io.unitTypes
                    })

                    $http.post("/home/brand/" + brandId + "/goodsType/" + obj.id + "/update", editData).success(function() {
                        obj.edit = false;
                        delete editData
                        obj.isgoodsMethodsShow = false;
                        //还原做法信息
                        obj.unitTypes[0].goodsMethods = obj.tempGoodsMethods;
                    }).error(function(res) {
                        alert(res.message)
                    })
                }
            }

        }




        //上传图片
        var uploader = $scope.uploader = new FileUploader({
            url: '/home/brand/' + brandId + '/upload',
            autoUpload: true
        });


        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        /*  uploader.onWhenAddingFileFailed = function (item, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function (fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
            };*/


        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            //console.log(response.url)
            $scope.goods.forEach(function(io) {
                if (io.edit) {
                    io.imageIsChange = true;
                    io.imageUrl = response.sha;
                    io.image56_56 = response.url;
                }
            })
        };
        $scope.delImage = function(obj) {
            obj.image56_56 = null
            obj.imageUrl = null
                //console.log("删除图片");
                //console.log(obj)
        }


        $scope.uploadImage = function(obj, e) {
            e.stopPropagation();
            obj.isImageShow = !obj.isImageShow;
        }

        $scope.stopPropagation = function(e) {
            e.stopPropagation();
        }

        //交换位置
        $scope.setswap = function(e, type, obj, index) {
            e.stopPropagation();

            if (type == 'up') {
                var temp = angular.copy($scope.goods[index]);
                $scope.goods[index] = $scope.goods[index - 1];
                $scope.goods[index - 1] = temp;
                var SwapGoodsType = {
                    id1: $scope.goods[index].id,
                    order1: $scope.goods[index].order,
                    id2: $scope.goods[index - 1].id,
                    order2: $scope.goods[index - 1].order
                }


            } else {
                var temp = angular.copy($scope.goods[index]);
                $scope.goods[index] = $scope.goods[index + 1];
                $scope.goods[index + 1] = temp;
                var SwapGoodsType = {
                    id1: $scope.goods[index].id,
                    id2: $scope.goods[index + 1].id
                }
            }
            //console.log(SwapGoodsType)
            $http.post("/home/brand/" + brandId + "/goodsType/swap", SwapGoodsType).success(function(res) {

            }).error(function(error) {
                alert(error.message)
            })
        }





    }])
})
