define(["angular", "uiRouter"], function() {
  var app = angular.module('sanyiapp', ['ui.router']);
  /*设置新增行自动获取焦点的指令*/
  app.directive('setfocus', function() {
    return function(scope, element) {
      element[0].focus();
    };
  });
  /*编写指令将timepicker的值更新到model中(时间指令)*/
  app.directive('timepicker', function() {
    return function(scope, element, attrs) {
      element.datetimepicker({
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 1,
        minView: 0,
        forceParse: 0
      }, element[0].value).on('changeDate', function(dateText) {
        var time = element[0].value;
        var modelPath = $(this).attr('ng-model');
        scope.bindTimeToAddingModel(modelPath, time);
        scope.$apply();
      })
    }
  })
  app.controller("homeController", function($scope, $http, $document) {
    $scope.isAdmin = isAdmin;
    $scope.brandId = brandId;
    $scope.renew = function(brand, shop) {
      location.href = globalObject.host + "home/renew?brand=" + brandId + "&shop=" + shop;
    }
    $scope.tenpay = function(brand, shop) {
      location.href = globalObject.host + "tenpayApply?brand=" + brandId + "&shop=" + shop;
    }

    $scope.buyShop=function(){
      location.href = globalObject.host + "home/pricing?brand="+brandId;
    }

    $scope.stopPropagation = function($event) {
      if ($event.stopPropagation)
        $event.stopPropagation();
      else
        $event.cancelBubble = true;
    }

    $document.bind("click", function() {
      $scope.choseCityArea = -1;
      $scope.choseListCityArea = -1;
      $scope.$apply();
    })


    //鉴权
    $http.get("/show/account/info").success(function(res) {
      $scope.isWhite=res.isWhite;
    })


    //选择城市
    var params = {
      shop: -1,
      page: 0,
      pageSize: 20
    }
    $scope.indexShop = "中国";
    $scope.isMenuOpen = false;
    $http.get("/home/brand/" + brandId + "/area/country/1/shops").success(function(res) {
      if (params.shopID) {
        res.forEach(function(obj) {
          obj.cities.forEach(function(city) {
            city.shops.forEach(function(shop) {
              if (shop.id == params.shopID) {
                $scope.indexShop = shop.name;
              }
            })
          })
        })
      }

      $document.on("click", function(e) {
        $scope.$apply(function() {
          if (e.target == $(".city-plug")[0] || $(".city-plug").has(e.target).length > 0) {
            //console.log("点到了")
            if (e.target == $(".btn.btn-default.dropdown-toggle")[0] || $(".btn.btn-default.dropdown-toggle").has(e.target).length > 0) {
              $scope.isMenuOpen = !$scope.isMenuOpen;
            }
          } else {
            $scope.isMenuOpen = false;
          }
        })
      })
      $scope.countryData = angular.copy(res);
      $scope.shopsData = [];
      $scope.selCountry = function(obj) {
        $scope.countryData.forEach(function(indexCountry) {
          indexCountry.sel = false;
        });
        obj.sel = true;
        $scope.Cities = obj.cities;
        $scope.Cities.forEach(function(indexCity) {
          indexCity.sel = false;
        })


        $scope.postFilter.province = obj.id;
        console.log($scope.postFilter)
        $scope.choseCityArea = -1;
        $scope.cityFocus = -1;
        params.page = 0;
        $scope.getData();
      }
      $scope.selCity = function(obj) {
        $scope.Cities.forEach(function(indexCity) {
          indexCity.sel = false;
        });
        obj.sel = true;
        $scope.indexShop = obj.name;
        $scope.shopsData = angular.copy(obj.shops);
        params.city = obj.id;
        $scope.choseCityArea = -1;
        params.page = 0;
        $scope.getData();
        $scope.isMenuOpen = false;
      }

      $scope.refreshShop = function() {
        params.shopID = null;
        params.page = 0;
        $scope.indexShop = "中国";
        $scope.Cities = false;
        $scope.countryData = angular.copy(res);
        $scope.isMenuOpen = false;

        $scope.choseCityArea = -1;
        params.page = 0;
        $scope.getData();


      }
    });

    $scope.choseCityArea = -1;
    $scope.brandProvinces = [];
    $scope.models = [];
    $scope.addingModel = {};
    $scope.addingModelTr = -1;
    $scope.provinceFocus = -1;
    $scope.cityFocus = -1;
    $scope.showFloatDiv = -1;
    $scope.addingModel.city = "";
    $scope.choseListCityArea = -1;
    $scope.priceToShop = [];;
    /*可选城市*/
    $scope.cities = [];
    /*页面记录数量*/
    $scope.recordCount = 0;

    /*查询门店列表时的过滤条件*/
    $scope.selectedArea = '中国';

    /*将指定的值绑定到$scope对象的指定属性上*/
    $scope.bindTimeToAddingModel = function(val, value) {
      eval("$scope." + val + "='" + value + "'");
    }

    /*根据过滤条件获取门店信息*/
    $scope.getData = function() {
      /*获取门店信息的过滤条件*/
      $http.post('/home/brand/' + brandId + '/shops', params).success(function(data) {
        $scope.models = data.shops;
        // $scope.packagePriceToModel();
        $scope.packageCityToModel();
        $scope.pages = data.pages;
        $scope.pages.showing = $scope.pages.showing.map(function(io, i) {
          return {
            name: io == null ? "..." : io + 1,
            active: io == params.page ? true : false
          }
        })
      })
    }

    $scope.nextPage = function() {
      if ($scope.pages.next == null) {
        return;
      } else {
        params.page = $scope.pages.next;
      }
      $scope.getData();
    }
    $scope.prevPage = function() {
      if ($scope.pages.previous == null) {
        return;
      } else {
        params.page = $scope.pages.previous;
      }
      $scope.getData();
    }

    $scope.changePage = function(x) {
      if (x.name == "...") return;
      params.page = x.name - 1;
      $scope.getData();
    }




    /*页面加载时获取门店及相关信息*/
    $http.get('/home/brand/' + brandId + '/shop/base').success(function(data) {
      $scope.priceToShop = data.shop2prices;
      $scope.cities = data.cities;
      $scope.getData();
    })


    /*将城市信息写入到model中*/
    $scope.packageCityToModel = function() {
      var cities = $scope.cities;
      $scope.models.forEach(function(model) {
        cities.forEach(function(city) {
          if (city.id == model.city) {
            model.city = city;
          }
        })
      })
    }

    /*将价格方案写入在model中*/
    // $scope.packagePriceToModel = function() {
    //   $scope.models.forEach(function(model) {
    //     var priceToShop = $scope.priceToShop;
    //     for (var i in priceToShop) {
    //       if (priceToShop[i].shop == model.id) {
    //         model.price = priceToShop[i].plan;
    //       }
    //     }
    //   })
    // }

    /*获取全国所有的城市展示在下拉列表中，供用户选择*/
    var getAllCitiesUrl = '/home/brand/' + brandId + '/area/country/1';
    $http.get(getAllCitiesUrl).success(function(data) {
        $scope.provinces = data;
      })
      /*显示或隐藏列表中的城市选择区域*/
    $scope.showOrHideListChoseArea = function() {
        if ($scope.choseListCityArea == -1) {
          $scope.choseListCityArea = 1;
        } else if ($scope.choseListCityArea == 1) {
          $scope.choseListCityArea = -1;
        }
      }
      /*显示或隐藏城市选择区域*/
    $scope.showOrHideChoseArea = function() {
        if ($scope.choseCityArea == -1) {
          $scope.choseCityArea = 1;
        } else if ($scope.choseCityArea == 1) {
          $scope.choseCityArea = -1;
        }

      }
      /*高亮省份的名称*/
    $scope.highLightProvince = function(val) {
        $scope.provinceFocus = val;
        $scope.showFloatDiv = val;
      }
      /*高亮城市名称*/
    $scope.highLightCity = function(val) {
        $scope.cityFocus = val;
      }
      /*在列表中选择城市*/
    $scope.choseCity = function(val) {
        $scope.cityFocus = val;
      }
      /*选择列表中的城市*/
    $scope.choseListCity = function(city) {
      $scope.cityFocus = city.id;
      $scope.addingModel.city = city;
      $scope.choseListCityArea = -1;
    }

    /*展开新增栏和编辑栏(参数为0时是新增，其他是编辑)*/
    $scope.showEditArea = function(val) {
      $scope.addingModelTr = val;
      if (val == 0) {
        $scope.addingModel = {};
        $scope.addingModel.city = ($scope.provinces)[0].cities[0];
      } else if (val == -1) {
        var tempModels = $scope.models;
        for (var i = 0; i < $scope.models.length; i++) {
          if (tempModels[i].id == $scope.tempModel.id) {
            tempModels[i] = JSON.parse(JSON.stringify($scope.tempModel));
            break;
          }
        }
      } else {
        $scope.models.forEach(function(model) {
          if (model.id == val) {
            $scope.tempModel = JSON.parse(JSON.stringify(model));
            $scope.addingModel = model;
          }
        })
      }
    }

    /*根据addingModel中的cityid获取city对象给赋给addingModel*/
    $scope.setAddingModelCityById = function() {
      var id = $scope.addingModel.city;
      $scope.provinces.forEach(function(province) {
        var cities = province.cities;
        cities.forEach(function(city) {
          if (city.id == id) {
            $scope.addingModel.city = city;
            return;
          }
        })
      })
    }

    /*遍历models,将修改过的数据展示出来*/
    $scope.showChangeData = function() {
      for (var i; i < $scope.models.length; i++) {
        if ($scope.models[i] == $scope.addingModel.id) {
          $scope.models[i] = $scope.addingModel;
          break;
        }
      }
    }

    $scope.onSync = function(id) {
      var ret = confirm("温馨提示: \n1) 同步配置到收银机后，会中断收银几秒钟;\n2) 今天被删除的数据也会同步下去，第二天才会彻底删除;\n是否要同步？")
      if (!ret) {
        return
      }
      var url = "/home/brand/" + brandId + "/shop/" + id + '/sync'
      Post(url, {}).success(function(data) {
        alert("已经成功下发同步命令到收银机，稍后会自动同步.")
      }).fail(function(xhr) {
        alert("同步失败，与门店的连接已断开.")
      })
    }

    $scope.saveModel = function(val) {
      if (val == 0) {
        $scope.saveAddModel();
      } else {
        $scope.saveEditModel();
      }
    }

    /*保存新增的门店信息*/
    $scope.saveAddModel = function() {
      var saveAddModelUrl = '/home/brand/' + brandId + '/shop';
      var postModel = JSON.parse(JSON.stringify($scope.addingModel));
      if (postModel.hasOwnProperty('city') && postModel.city != undefined) {
        postModel.city = postModel.city.id;
      }
      $http.post(saveAddModelUrl, postModel).success(function(data) {
        $scope.recordCount = $scope.recordCount + 1;
        $scope.addingModel.id = data.shop.id;
        $scope.addingModel.planId = data.pricePlan.id;
        $scope.setAddingModelCityById();
        $scope.models.unshift($scope.addingModel);
        $scope.addingModelTr = -1;
      })
    }

    /*保存修改的门店信息*/
    $scope.saveEditModel = function() {
      var shopId = $scope.addingModel.id;
      var saveEditModelUrl = '/home/brand/' + brandId + '/shop/' + shopId;
      var postModel = JSON.parse(JSON.stringify($scope.addingModel));
      postModel.city = postModel.city.id;
      $http.post(saveEditModelUrl, postModel).success(function(data) {
        $scope.setAddingModelCityById();
        $scope.showChangeData()
        $scope.addingModelTr = -1;
      })
    }





  })

})
