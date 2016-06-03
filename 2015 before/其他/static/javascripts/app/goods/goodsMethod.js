define(["angular","uiRouter"],function(){
  var app = angular.module('sanyiapp', ['ui.router']);
var brandId = location.pathname.replace('/home/brand/', '').replace(/(\w+)(\/.+)?/gi, "$1");
  app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/assets/templates/goods/goodsMethod.html',
        controller: 'goodsMethodController'
      })
	  .state('detail', {
		url: '/detail',
		templateUrl: '/assets/templates/goods/methodDetail.html',
		controller: 'methodDetailController'
	  })
  })
app.controller("goodsMethodController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
	$scope.brandId = brandId
	var params;
	if ($location.search().page || $location.search() == 0) {
		params = $location.search();
	} else {
		params = {
			group: null,
			subgroup: null,
			page: 0
		};
		$location.search(params);
	}

	var groups, subgroups;
	$http.get("/home/brand/" + brandId + "/goods/methods/groups").success(function (res) {
		//console.log(res);
		groups = angular.copy(res.groups);
		subgroups = angular.copy(res.subgroups);
		var allGroup = {
			id: -1,
			name: "所有",
			productType: -1,
			count: 0,
			sel: true
		};
		var allsubgroups = {
			id: -1,
			name: "所有",
			productType: -1,
			count: 0,
			sel: true
		};
		res.groups.forEach(function (group) {
			group.sel = false;
			allGroup.count += group.count;
		});
		res.groups.unshift(allGroup);
		res.subgroups.unshift(allsubgroups);
		$scope.groups = res.groups;
		$scope.subgroups = res.subgroups;
		getGoods();
	})


	//选择大类
	$scope.selGroups = function (obj) {
		$scope.subgroups.forEach(function (io) {
			io.sel = false;
			if (io.group == obj.id) {
				io.show = true;
			} else {
				io.show = false;
			}
		})

		$scope.groups.forEach(function (io) {
			io.sel = false;
		})
		obj.sel = true;
		params.subgroup = null;
		params.group = obj.id;
		params.page = 0;
		getGoods();
	}

	//选择小类
	$scope.selSubGroups = function (obj) {
		$scope.subgroups.forEach(function (io) {
			io.sel = false;
		})
		obj.sel = true;
		params.subgroup = obj.id;
		params.page = 0;
		getGoods();
	}

	function getGoods() {
		$location.search(params);
		$http.get("/home/brand/" + brandId + "/goods/methods", {
			params: params
		}).success(function (res) {
			res.goodsMethods.forEach(function (io) {
				io.edit = false;
				io.add = false;
				io.allGroups = angular.copy(groups);
				io.allSubGroups = angular.copy(subgroups);
				io.subGroups = (function () {
					var arr = [];
					io.allSubGroups.forEach(function (subgroup) {
						if (subgroup.group == io.group) {
							arr.push(subgroup);
						}
					})
					return arr;
				})();


				io.groupName = (function () {
					for (var i = 0; i < io.allSubGroups.length; i++) {
						if (io.allSubGroups[i].id == io.subgroup) {
							return io.allSubGroups[i].name
						}
					}
				})();

				io.subgroupName = (function () {
					for (var i = 0; i < io.allSubGroups.length; i++) {
						if (io.allSubGroups[i].id == io.subgroup) {
							return io.allSubGroups[i].name
						}
					}
				})();

			})

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
			$scope.methodData = res.goodsMethods;
			$scope.pageShowing = res.pages.showing;
			$scope.goodsData = res;
		})

	}

	//下一页
	$scope.pageNext = function (num) {
		params.page = num;
		getGoods();
	};

	//上一页
	$scope.pagePrevious = function (num) {
			params.page = num;
			getGoods();
		}
		//跳到当前页面
	$scope.indexPage = function (num) {
		if (num != "...") {
			params.page = num - 1;
			getGoods();
		}
	}


	//添加菜品
	$scope.addMethod = function () {
		for (var i = 0; i < $scope.methodData.length; i++) {
			if ($scope.methodData[i].add) {
				return
			}
		}
		//还原恢复状态
		$scope.methodData.forEach(function (io, index) {
			if (io.edit) {
				$scope.methodData[index] = tempMehod;
			}
			io.edit = false;
		})
		newMethodData = {
			name: "",
			group: angular.copy(groups)[0].id,
			subgroup: returnSubGroups()[0].id,
			remark: "",
			edit: true,
			add: true,
			allGroups: angular.copy(groups),
			allSubGroups: angular.copy(subgroups),
			subGroups: returnSubGroups(),
			productType: 7,
			unitType: 1,
			spicyLevel: 0
		}
		//console.log(newMethodData)
		$scope.methodData.unshift(newMethodData);
		setTimeout(function () {
			$(".editing").find("input").eq(0).trigger("select");
		}, 100)
	}

	function returnSubGroups() {
		var tamp_subgroup = angular.copy(subgroups);
		var arr = [];
		tamp_subgroup.forEach(function (io) {
			if (io.group == angular.copy(groups)[0].id) {
				arr.push(io)
			}
		})
		return arr;
	}






	var tempMehod;
	$scope.editing = function (obj) {
		tempMehod = angular.copy(obj);
		$scope.methodData.forEach(function (io) {
			if (io.edit) {
				io.group = tempMehod.group;
				io.groupName = tempMehod.groupName;
				io.name = tempMehod.name;
				io.subgroup = tempMehod.subgroup;
				io.subgroupName = tempMehod.subgroupName;
				io.remark = tempMehod.remark;
			}
			io.edit = false;
		})
		obj.edit = true;
	}

	$scope.cancelEdit = function (obj, e) {
		e.stopPropagation();
		//console.log(tempMehod);
		if (obj.add) {
			$scope.methodData.splice(0, 1);
		} else {
			obj.group = tempMehod.group;
			obj.groupName = tempMehod.groupName;
			obj.name = tempMehod.name;
			obj.subgroup = tempMehod.subgroup;
			obj.subgroupName = tempMehod.subgroupName;
			obj.remark = tempMehod.remark;
			obj.edit = false;
		}

	}
	$scope.saveMethod = function (obj, e) {
		e.stopPropagation();
		if (e.type == "click" || e.keyCode == 13) {
			if (obj.name == "") {
				obj.nameError = true;
			} else {
				obj.nameError = false;
				if (obj.add) {
					$http.post("/home/brand/" + brandId + "/goods", obj).success(function (res) {
						obj.edit = false;
						obj.add = false;
						obj.id = res.id;
						obj.groupName = (function () {
							for (var i = 0; i < obj.allSubGroups.length; i++) {
								if (obj.allSubGroups[i].id == obj.subgroup) {
									return obj.allSubGroups[i].name
								}
							}
						})();

						obj.subgroupName = (function () {
							for (var i = 0; i < obj.allSubGroups.length; i++) {
								if (obj.allSubGroups[i].id == obj.subgroup) {
									return obj.allSubGroups[i].name
								}
							}
						})();

					}).error(function(error){
            alert(error.message)
          })
				} else {
					$http.post("/home/brand/" + brandId + "/goods/" + obj.id, obj).success(function (res) {
						obj.edit = false;
					}).error(function(error){
            alert(error.message)
          })

				}
			}
		}
	}
	
	$scope.delMethod=function(obj,index){
	$http.delete("/home/brand/"+brandId+"/goods/"+obj.id).success(function(res){
		$scope.methodData.splice(index,1);	
	}).error(function(res){
		alert(res.message);
	})
	}
	
	$scope.goDetail = function(e, id){
		e.stopPropagation()
		location.href = "/home/brand/" + brandId + "/goods/method#/detail?id=" + id
	}
}])
	app.controller("methodDetailController", ["$scope", "$http", "$location", "$document", "$timeout", function ($scope, $http, $location, $document, $timeout) {
		$scope.goodsType = $location.search().id
		setTimeout(function () {
			$('.datepickerTime').datetimepicker()
		}, 300)
		$scope.showShopState = 1
		$scope.states = [{"id": 1, "name": "正在销售门店", "selected": false},{"id": 0, "name": "未销售门店", "selected": false}]
		$scope.goods = $location.search().set
		$scope.indexTab = "中国"
		$scope.isMenuOpen = false

		function getModels(province, city){
			var params = {province: province, city: city}
			var url = "/home/brand/" + brandId + "/goodsType/" + $scope.goodsType + "/apply/shop"
			$http.get(url, {params: params}).success(function (data) {
				$scope.goodsTypeName = data.goodsType.name
				$scope.isLoding = false
				var models = data.shops
				$scope.serviceHours = data.serviceHours
				packageServiceHours()
				addModel.serviceHour = data.serviceHours[0].id
				models.forEach(function (model) {
					model.hasApply = false
					model.serviceHour = $scope.serviceHours[0].id
					model.serviceHourName = $scope.serviceHours[0].name
					model.monday = true
					model.tuesday = true
					model.wednesday = true
					model.thursday = true
					model.friday = true
					model.saturday = true
					model.sunday = true
					model.beginTime = getTime()
					model.goodses.forEach(function (goods) {
						if (goods.product != undefined){
							model.hasApply = true
							goods.price = goods.product.price
							goods.newPrice = goods.price
							model.beginTime = goods.product.beginTime
							model.monday = goods.product.monday
							model.tuesday = goods.product.tuesday
							model.wednesday = goods.product.wednesday
							model.thursday = goods.product.thursday
							model.friday = goods.product.friday
							model.saturday = goods.product.saturday
							model.sunday = goods.product.sunday
							$scope.serviceHours.forEach(function (serviceHour) {
								if (serviceHour.id == goods.product.serviceHour) {
									model.serviceHour = serviceHour.id
									model.serviceHourName = serviceHour.name
									return
								}
							})
							return
						}
					})
				})
				$scope.sourceModels = models
				$scope.models = angular.copy($scope.sourceModels)
				addIndex($scope.models)
				if($scope.showShopState == undefined){
					$scope.showShopState = 1
				}
				$scope.tab($scope.showShopState)
			})
		}
		getModels()

		function packageServiceHours(){
			var model = {"id": -1, "name": "全部市别"}
			$scope.serviceHours.unshift(model)
		}

		$http.get("/home/brand/" + brandId + "/area/country/1/shops").success(function (areaData) {
			$scope.countryData = areaData
		})

		$scope.stopPropagation = function(event){
			event.stopPropagation()
		}

		/**
		 * 选择国家
		 */
		$scope.selCountry = function(){
			$scope.indexTab = "中国"
			getModels()
			$scope.countryData.forEach(function(province){
				province.selected = false
			})
			$scope.cities.forEach(function(city){
				city.selected = false
			})
		}

		/*选择省*/
		$scope.selProvince = function(province){
			$scope.countryData.forEach(function(province){
				province.selected = false
			})
			$scope.cities = province.cities
			$scope.indexTab = province.name
			province.selected = true
			getModels(province.id)
			$scope.cities.forEach(function(city){
				city.selected = false
			})
		}

		/*选择城市*/
		$scope.selCity = function(city){
			$scope.cities.forEach(function(city){
				city.selected = false
			})
			$scope.indexTab = city.name
			city.selected = true
			getModels(city.province, city.id)
		}

		/*添加序号*/
		function addIndex(models){
			var a = 0; var b = 0
			models.forEach(function(model){
				if(model.hasApply){
					a = a + 1
					model.index = a
				} else {
					b = b + 1
					model.index = b
				}
			})
		}

		/*切换状态*/
		$scope.tab = function(id){
			$scope.states.forEach(function(x){
				x.selected = false
				if(x.id == id){
					x.selected = true
				}
			})
			$scope.showShopState = id
			$scope.judgeAllSelected()
		}

		/*关闭编辑框*/
		$scope.closeEdit = function(){
			$scope.models = angular.copy($scope.sourceModels)
			addIndex($scope.models)
		}

		/*打开编辑框*/
		$scope.openEdit = function(m){
			if(m.isEdit){
				return
			} else {
				$scope.closeEdit()
				$scope.models.forEach(function(model){
					model.isEdit = false
					if(model.shop == m.shop){
						model.isEdit = true
					}
				})
				setTimeout(function () {
					$('.datepickerTime').datetimepicker()
				}, 300)
			}
		}

		/*保存编辑结果*/
		$scope.saveData = function(e, model){
			var postModel = angular.copy(model)
			postModel.shops = [model.shop]
			postModel.goodses.forEach(function(goods){
				if(goods.newPrice == ''){
					delete goods.newPrice
				}
			})
			if(postModel.serviceHour == -1){
				delete postModel.serviceHour
			}
			var url = '/home/brand/' + brandId + '/goodsType/' + $scope.goodsType + '/apply/shop'
			$http.post(url, postModel).success(function(data){
				for(var i=0; i<$scope.sourceModels.length;i++){
					if($scope.sourceModels[i].shop == model.shop){
						model.goodses.forEach(function(g){
							g.price = g.newPrice
						})
						$scope.serviceHours.forEach(function (serviceHour) {
							if(model.serviceHour == serviceHour.id){
								model.serviceHourName = serviceHour.name
								return
							}
						})
						$scope.sourceModels[i] = model
						$scope.sourceModels[i].hasApply = true
						$scope.sourceModels[i].isEdit = false
						break
					}
				}
				$scope.closeEdit()
				openNextEdit(model.shop)
			})
		}

		/**
		 * 打开下一个编辑栏
		 * @param shop
		 */
		function openNextEdit(shop){
			var index = 0
			for(var i=0; i<$scope.models.length; i++){
				if($scope.models[i].shop == shop){
					index = i + 1
					break
				}
			}
			while(index < $scope.models.length){
				if($scope.models[index].hasApply != $scope.showShopState){
					index ++
				} else {
					$scope.models[index].isEdit = true
					var doms = document.getElementsByName("newPrice2")
					var i = $scope.models[i].goodses.length * index
					$timeout(function(){
						doms[i].focus()
						$scope.$apply()
					}, 100)
					return
				}
			}
		}

		/*取消编辑*/
		$scope.cancelEdit = function(e,m){
			e.stopPropagation()
			m.isEdit = false
			$scope.closeEdit()
		}

		function recoverModel(model){
			model.hasApply = false
			model.isEdit = false
			model.beginTime = getTime()
			model.serviceHour = $scope.serviceHours[0].id
			model.serviceHourName = $scope.serviceHours[0].name
			model.monday = true
			model.tuesday = true
			model.wednesday = true
			model.thursday = true
			model.friday = true
			model.goodses.forEach(function(goods){
				delete goods.price
				delete goods.newPrice
				delete goods.product
			})
		}

		/*删除记录*/
		$scope.deleteData = function(shop){
			var url = '/home/brand/' + brandId + '/goodsType/' + $scope.goodsType + '/apply/shop/' + shop
			$http.delete(url).success(function(data){
				$scope.sourceModels.forEach(function(model){
					if(model.shop == shop){
						recoverModel(model)
					}
				})
				$scope.models.forEach(function(model){
					if(model.shop == shop){
						recoverModel(model)
					}
				})
				addIndex($scope.sourceModels)
				addIndex($scope.models)
			})
		}

		/**
		 * 获取当天日期
		 * @returns {string}
		 */
		function getTime(){
			var d = new Date()
			var year = d.getFullYear()
			var month = d.getMonth()
			if(month < 10){
				month = "0" + ++month
			}else {
				if(month == 12){
					month = "01"
				}else {
					month = ++month
				}
			}
			var day = d.getDate()
			if(day < 10){
				day = "0" + day
			}
			return year + "-" + month + "-" + day
		}

		var addModel = {
			"newPrice": undefined,
			"serviceHour": -1,
			"monday": true,
			"tuesday": true,
			"wednesday": true,
			"thursday": true,
			"friday": true,
			"saturday": true,
			"sunday": true,
			"beginTime": getTime()
		}

		/*选择所有的门店*/
		$scope.selectAllShop = function(){
			$scope.models.forEach(function(model){
				if(model.hasApply == $scope.showShopState){
					model.selected = $scope.allSelected
				}
			})
			$scope.sourceModels.forEach(function(model){
				if(model.hasApply == $scope.showShopState){
					model.selected = $scope.allSelected
				}
			})
			$scope.batchAddShow = $scope.allSelected
			$scope.showAddBatch()
		}

		$scope.judgeAllSelected = function(){
			$scope.allSelected = true
			$scope.sourceModels.forEach(function(model){
				if(!model.selected && model.hasApply == $scope.showShopState){
					$scope.allSelected = false
					return
				}
			})
		}

		/*展开批量设置栏*/
		$scope.showAddBatch = function(){
			$scope.batchAddShow = false
			$scope.sourceModels.forEach(function(model){
				if(model.selected && model.hasApply == $scope.showShopState){
					$scope.batchAddShow = true
					$scope.addModel = addModel
					return
				}
			})
		}

		/*选择某个门店*/
		$scope.selectShop = function(event, model){
			event.stopPropagation()
			model.selected = !model.selected
			$scope.sourceModels.forEach(function(m){
				if(m.shop == model.shop){
					m.selected = model.selected
					return
				}
			})
			$scope.judgeAllSelected()
			$scope.showAddBatch()
		}

		function recoverModels(models){
			for(var i=0; i< models.length; i++){
				if(models[i].hasApply == $scope.showShopState && models[i].selected){
					var shop = models[i].shop
					var goodses = models[i].goodses
					var serviceHourName = models[i].serviceHourName
					var name = models[i].name
					var index = models[i].index
					models[i] = angular.copy($scope.addModel)
					models[i].shop = shop
					models[i].name = name
					models[i].index = index
					models[i].serviceHourName = serviceHourName
					models[i].goodses = goodses
					models[i].goodses.forEach(function(goods){
						goods.price = $scope.addModel.newPrice
						goods.newPrice = goods.price
					})
					if($scope.addModel.newPrice == undefined){
						models[i].hasApply = false
					} else {
						models[i].hasApply = true
					}
				}
			}
		}

		/*批量保存门店定价*/
		$scope.batchSave = function(){
			var url = "/home/brand/" + brandId + "/goodsType/" + $scope.goodsType + "/apply/shop/batch"
			if($scope.addModel.newPrice == undefined || $scope.addModel.newPrice.length == 0){
				delete $scope.addModel.newPrice
			}
			if($scope.addModel.newPrice == undefined || $scope.addModel.newPrice.length == 0){
				if(!confirm("新价格为空时,将删除此菜品在门店的定价方案, 确认删除吗?")) return
			}
			var postModel = angular.copy($scope.addModel)
			postModel.shops = []
			postModel.goodses = []
			if(postModel.serviceHour == -1){
				delete postModel.serviceHour
			}
			$scope.models.forEach(function(model){
				if(model.hasApply == $scope.showShopState && model.selected){
					postModel.shops.push(model.shop)
				}
			})
			$http.post(url, postModel).success(function(data){
				$scope.allSelected = false
				recoverModels($scope.sourceModels)
				recoverModels($scope.models)
			})
		}

		$scope.openMenu = function(e){
			e.stopPropagation()
			$scope.isMenuOpen = !$scope.isMenuOpen
		}

		/**
		 * 监听键盘事件响应
		 * @param event
		 * @param model
		 */
		$scope.keyDown = function(event, model){
			if(event.keyCode == 13 && model.isEdit){
				$scope.saveData(event, model)
			}
		}
		$document[0].onclick = function(event){
			$scope.isMenuOpen = false
			$scope.$apply()
		}
	}])
})
