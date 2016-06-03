define(["memberApp","directive.page"], function(app) {
    app.controller('addMemberTypeController', function($scope, $http, $timeout, FileUploader) {
        $scope.model = {};

        /*获取当前路径url*/
        var url = window.location.href;
        /*从url中截取品牌id*/
        $scope.model.brandId = brandId;

        /*获取积分类型*/
        var getPointChangeTypesUrl = '/home/brand/' + $scope.model.brandId + '/system/pointchangetype'
        $http.get(getPointChangeTypesUrl).success(function(data) {
            $scope.pointChangeTypes = data.pointChangeTypes;
        })

        /*显示挂账区域*/
        $scope.showDebitArea = -1;
        $scope.showDebit = function() {
            if ($scope.showDebitArea == -1) {
                $scope.showDebitArea = 1;
            } else if ($scope.showDebitArea == 1) {
                $scope.showDebitArea = -1;
            }
        }

        /*获取所有有权限查看的门店*/
        var getShopsUrl = '/home/brand/' + brandId + '/area/country/1/shops';
        $http.get(getShopsUrl).success(function(data) {
            $scope.provinces = data;
            $scope.firstProvince = {};
            $scope.firstProvince.id = -1;
            $scope.firstProvince.name = "省份";
            $scope.provinces.unshift($scope.firstProvince);

            var cities = [];
            $scope.firstCity = {};
            $scope.firstCity.id = -1;
            $scope.firstCity.name = "城市";
            cities.unshift($scope.firstCity);
            /*tempShops只记录门店是否处于选中状态，在操作时不改变结构，只修改isSelected状态*/
            $scope.tempShops = [];
            $scope.provinces.forEach(function(province) {
                if (province.id != -1) {
                    var cities = province.cities;
                    cities.forEach(function(city) {
                        var shops = city.shops;
                        shops.forEach(function(shop) {
                            var s = {};
                            s.province = province;
                            s.city = city;
                            s.shop = shop;
                            s.isSelected = false;
                            $scope.tempShops.push(s);
                        })
                    })
                }
            })

            $scope.selectedProvince = $scope.firstProvince;

            $scope.selectedProvince.cities = cities;
            $scope.selectedCity = $scope.firstCity;
            $scope.recordCount = $scope.tempShops.length;
            /*temp是操作门店时实际改变的数据，切换省份和城市时会对其进行修改*/
            $scope.temp = JSON.parse(JSON.stringify($scope.tempShops));
            $scope.showRecordByPage();
        })


        $scope.selectProvince = function(val) {
            $scope.isSelectAll = false;
            $scope.shareObject.currentPage = 1;
            $scope.currentPage = 1;
            $scope.temp = JSON.parse(JSON.stringify($scope.tempShops));
            $scope.provinceShops = [];
            $scope.selectedProvince = val;
            if (val.cities[0].id != -1) {
                var cities = $scope.selectedProvince.cities;
                cities.unshift($scope.firstCity);
            }
            $scope.selectedCity = $scope.firstCity
            if ($scope.selectedProvince.id != -1) {
                var shops = $scope.temp;
                for (var i = 0; i < shops.length; i++) {
                    if (shops[i].province.id != $scope.selectedProvince.id) {
                        shops.splice(i, 1);
                        i--;
                    }
                }
                $scope.recordCount = $scope.temp.length;
                $scope.provinceShops = JSON.parse(JSON.stringify($scope.temp));
                $scope.showRecordByPage()
            } else {
                $scope.recordCount = $scope.temp.length;
                $scope.showRecordByPage();
                return;
            }
        }

        /*切换城市前，将当前城市的选中状态保存到省份中*/
        $scope.saveStateTOProvinceShops = function() {
            $scope.provinceShops.forEach(function(provinceShop) {
                $scope.temp.forEach(function(t) {
                    if (provinceShop.shop.id == t.shop.id) {
                        provinceShop.isSelected = t.isSelected;
                        return;
                    }
                })
            })
        }

        $scope.selectCity = function(val) {
            $scope.saveStateTOProvinceShops();
            $scope.shareObject.currentPage = 1;
            $scope.currentPage = 1;
            $scope.temp = JSON.parse(JSON.stringify($scope.provinceShops));
            $scope.isSelectAll = false;
            $scope.selectedCity = val;
            if ($scope.selectedCity.id != -1) {
                var shops = $scope.temp;
                for (var i = 0; i < shops.length; i++) {
                    if (shops[i].city.id != $scope.selectedCity.id) {
                        shops.splice(i, 1);
                        i--;
                    }
                }
                $scope.recordCount = $scope.temp.length;
                $scope.showRecordByPage();
            } else {
                $scope.selectProvince($scope.selectedProvince);
            }
        }

        $scope.selectAllShop = function() {
            $scope.selectedShops = [];
            $scope.temp.forEach(function(t) {
                t.isSelected = $scope.isSelectAll
                if ($scope.isSelectAll == true) {
                    $scope.selectedShops.push(t.shop.id);
                }
            })
            $scope.saveShopState();
            $scope.showRecordByPage();
        }

        $scope.selectedShops = [];
        $scope.addOrRemoveSelectedShop = function(val) {
            var isContained = false;
            $scope.selectedShops.forEach(function(selectedShop) {
                if (selectedShop == val.shop.id) {
                    isContained = true;
                    return;
                }
            })
            if (val.isSelected == true && isContained == false) {
                $scope.selectedShops.push(val.shop.id);
            } else if (val.isSelected == false && isContained == true) {
                var selectedShops = $scope.selectedShops;
                for (var i = 0; i < selectedShops.length; i++) {
                    if (selectedShops[i] == val.shop.id) {
                        selectedShops.splice(i, 1);
                        i--;
                    }
                }
            }
            $scope.temp.forEach(function(t) {
                t.isSelected = false;
                $scope.selectedShops.forEach(function(selectedShop) {
                    if (t.shop.id == selectedShop) {
                        t.isSelected = true;
                        return;
                    }
                })
            })
            $scope.saveShopState();
            $scope.judgeIsAllSelected();
        }

        /*将门店状态保存到tempShops中*/
        $scope.saveShopState = function() {
            $scope.tempShops.forEach(function(tempShop) {
                tempShop.isSelected = false;
                $scope.selectedShops.forEach(function(selectedShop) {
                    if (tempShop.shop.id == selectedShop) {
                        tempShop.isSelected = true;
                        return;
                    }
                })
            })
        }

        /*判断temp中的门店是否全部选中*/
        $scope.judgeIsAllSelected = function() {
            $scope.isSelectAll = true;
            $scope.temp.forEach(function(t) {
                var isContain = false;
                $scope.selectedShops.forEach(function(selectedShop) {
                    if (t.shop.id == selectedShop) {
                        isContain = true;
                        return;
                    }
                })
                if (isContain == false) {
                    $scope.isSelectAll = false;
                    return;
                }
            })
        }

        /*分页*/
        $scope.pageSize = 5;
        $scope.recordCount = 0;
        /*设置一个对象，方便子作用域操作*/
        $scope.shareObject = {}
            /*当前选择的分页*/
        $scope.shareObject.currentPage = 1;
        $scope.currentPage = 1;


        $scope.searchMembers = function() {
            $scope.currentPage = $scope.shareObject.currentPage;
            $scope.showRecordByPage();
        }


        $scope.showRecordByPage = function() {
            $scope.shops = JSON.parse(JSON.stringify($scope.temp));
            $scope.shops = $scope.shops.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
            $scope.judgeIsAllSelected();
        }



        $scope.showWaringArea = -1;
        /*校验用户名是否已存在*/
        $scope.checkDupName = function(val) {
            $scope.hasMutpName = -1;
            if (val != undefined && val.length > 0) {
                var checkDupNameUrl = '/home/brand/' + $scope.model.brandId + '/member/type/check/name';
                var postModel = {};
                postModel.name = val;
                $http.post(checkDupNameUrl, postModel).success(function(data) {
                    var result = data.result;
                    if (result.length > 0) {
                        $scope.showWaringArea = 1;
                        $scope.hasMutpName = 1;
                    }
                })
            }
        }


        $scope.hideWarningArea = function() {
            $scope.showWaringArea = -1;
        }

        /*确认该品牌是否已添加微信会员*/
        var confirmUrl = '/home/brand/' + $scope.model.brandId + '/member/type/check/weixin';
        $http.get(confirmUrl).success(function(data) {
            $scope.isWeixin = data.result;
        })

        $scope.model.is_weixin = false;

        /*选中是否添加微信会员单选框*/
        $scope.choseWeixin = function() {
            /*选中单选框时弹出提示信息*/
            if ($scope.model.is_weixin == true && $scope.isWeixin == true) {
                var confirmWeixin = confirm("品牌已添加微信会员类型，是否确认更改微信会员类型？");
                if (confirmWeixin == false) {
                    $scope.model.is_weixin = false;
                }
            }
        }
        $scope.isCash = 1;
        /*切换积分规则时改变页面样式*/
        $scope.changeRule = function(val) {
            if (val == 1) {
                $scope.isCash = 1;
            }
            if (val == 2) {
                $scope.change_amount = 0;
                $scope.isCash = -1;
            }
        }

        /*切换会员卡方案时改变页面样式*/
        $scope.choseChange = function(val) {
            if (val == "会员价格") {
                $("#memberTypePlan").html('会员价格');
                $scope.plans = $scope.pricePlans;
            }
            if (val == "会员折扣") {
                $("#memberTypePlan").html("会员折扣");
                $scope.plans = $scope.discountPlans;
            }
        }

        /*格式化时间*/
        $scope.dateFormat = function(val) {
            var year = val.getFullYear();
            var month = val.getMonth() + 1;
            var day = val.getDate();
            var newDate = year + '-' + month + '-' + day;
            return newDate;
        }

        /*处理会员积分规则部分数据，将其绑定到model中*/
        /*传递到后台的会员营销对象数组（分为积分规则和积分冲抵现金两部分）*/
        $scope.setMemberPromotions = function() {
            /*会员积分兑换*/
            $scope.model.pointChangePromotion = {};
            if ($scope.model.integrationRule == "按金额") {
                $scope.model.pointChangePromotion.pointType = "ByAmount";
                $scope.model.pointChangePromotion.amount = $scope.model.yuan;
            } else if ($scope.model.integrationRule == "按次数") {
                $scope.model.pointChangePromotion.pointType = "FixedOnce";
                delete $scope.model.pointChangePromotion.amount;
            }
            $scope.model.pointChangePromotion.point = $scope.model.fen;

            /*积分抵用现金*/
            $scope.model.pointRedeemPromotion = {};
            if ($scope.model.isuse == true) {
                $scope.model.pointRedeemPromotion.amount = $scope.model.cash;
                $scope.model.pointRedeemPromotion.point = $scope.model.integral;
            } else {
                delete $scope.model.pointRedeemPromotion;
            }
        }

        /*将时间段转换为天数*/
        $scope.timeSwitch = function(time) {
            var mils = 0;
            switch (time) {
                case "100年":
                    mils = 36500;
                    break;
                case "10年":
                    mils = 3650;
                    break;
                case "5年":
                    mils = 1825;
                    break;
                case "2年":
                    mils = 730;
                    break;
                case "1年":
                    mils = 365;
                    break;
                case "6个月":
                    mils = 180;
                    break;
                case "3个月":
                    mils = 90;
                    break;
                case "1个月":
                    mils = 30;
                    break;
                default:
                    mils = "";
            }
            return mils;
        }

        $scope.showAlert = -1;


        $scope.model.is_cash = true;
        $scope.model.is_debit = false;

        $scope.model.debit_validity = "1年";
        $scope.model.validity = "10年";
        $scope.showDebit();
        $scope.model.need_card = true;
        $scope.model.point_change_type = 2;
        $scope.model.change_amount = 1;
        $scope.model.change_point = 1;
        $scope.model.show_all_shop_info = true;
        $scope.model.show_service_phone = true;

        /*填写完成后提交*/
        $scope.saveModel = function() {
            if ($scope.model.name != undefined && $scope.model.name.length > 0) {
                var checkDupNameUrl = '/home/brand/' + $scope.model.brandId + '/member/type/check/name';
                var postTo = {};
                postTo.name = $scope.model.name;
                $http.post(checkDupNameUrl, postTo).success(function(data) {
                    var result = data.result;
                    if (result.length > 0) {
                        $scope.showWaringArea = 1;
                        $scope.hasMutpName = 1;
                    }
                    if ($scope.selectedShops.length == 0) {
                        alert("请选择关联门店!");
                        return;
                    }

                    if ($scope.hasMutpName != 1) {
                        /*封装一个新的，完全符合后台要求的postModel传递到后台去*/
                        var postModel = {};
                        postModel.shops = $scope.selectedShops;
                        postModel.brandId = $scope.model.brandId;
                        postModel.name = $scope.model.name;
                        postModel.remark = $scope.model.remark;
                        postModel.shop_description = $scope.model.shop_description;
                        postModel.show_all_shop_info = $scope.model.show_all_shop_info;
                        postModel.show_service_phone = $scope.model.show_service_phone;
                        postModel.is_cash = $scope.model.is_cash;
                        postModel.need_card = $scope.model.need_card;
                        postModel.is_weixin = $scope.model.is_weixin;
                        postModel.is_debit = $scope.model.is_debit;
                        postModel.debit_credit = $scope.model.debit_credit;
                        postModel.debit_validity = $scope.timeSwitch($scope.model.debit_validity);
                        postModel.point_change_type = $scope.model.point_change_type;
                        postModel.change_amount = $scope.model.change_amount;
                        postModel.change_point = $scope.model.change_point;
                        postModel.state = 1;
                        postModel.validity = $scope.timeSwitch($scope.model.validity);
                        postModel.image = $scope.model.image
                        postModel.image_url = $scope.model.image_url
                        if (!postModel.hasOwnProperty("change_amount")) {
                            postModel.change_amount = 0;
                        }
                        if (postModel.is_debit == false) {
                            postModel.debit_credit = 0;
                            postModel.debit_validity = 0;
                        }
                        /*拼接出传递到后台的url*/
                        var createBrandUrl = '/home/brand/' + $scope.model.brandId + '/member/type';
                        $http.post(createBrandUrl, postModel).success(function(data) {
                            $scope.showAlert = 1;
                            var href = '#showAlert';
                            window.location.href = href;
                            $timeout(function() {
                                $scope.showAlert = -1;
                                var href = '/home/brand/' + 　$scope.model.brandId　 + '/member/type#/list';
                                window.location.href = href;
                            }, 5000)
                        })
                    } else {
                        alert("已存在同名会员类型!");
                    }
                })
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
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            //console.log(response.url)
            $scope.model.image = response.sha;
            $scope.model.image_url = response.url;
        };

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









    })
})
