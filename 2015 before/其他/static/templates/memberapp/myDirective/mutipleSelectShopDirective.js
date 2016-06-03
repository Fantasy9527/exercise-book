app.directive('shop',function(){
		return {
			    templateUrl:'/assets/templates/memberapp/myDirective/mutipleSelectCityDirective.html',
				replace:true,
				transclude:true,
				scope:true,
				link:function(scope,element,attrs){

				/*设置下拉多选框*/
				scope.showingShopView = -1;
				scope.selectedShops = [];
				scope.isShopFocus = -1;
				/*显示门店选择浮动栏*/
				scope.showFloatDiv = -1;
				/*判断某次点击事件是否是在操作div中的button*/
				scope.isShopOperateButton = false;
				
				/*判断某次mouseOver是否作用于城市上的*/
				scope.isCityMouseOver = false;
				/*判断某次mouseOver是否作用于门店上的*/
				scope.isShopMouseOver = false
				
				scope.showShopSelectBox = 1;
				
				
				/*隐藏或显示选择区域*/
				scope.showOrHideShopSelectArea=function(){
					if(scope.isShopOperateButton == false){
						if(scope.showingShopView == -1){
							scope.showingShopView = 1;
						}else if(scope.showingShopView == 1){
							scope.showingShopView = -1;
						}
					}
					scope.isShopOperateButton = false;
				}
				
				
				/*显示门店选择区域*/
				scope.showShopSelectArea=function(id){
					scope.showFloatDiv = id;
					scope.isShopMouseOver = true;
				}
				
				/*鼠标移动到城市名称上时，将其高亮，并显示门店选择浮动栏*/
				scope.mouseOverCity=function(val){
					scope.isCityFocus = val;
					scope.showFloatDiv = val;
					scope.isCityMouseOver=true;
				}
				
				
				/*鼠标移动到非城市非门店区域时，移除所有的高亮*/
				scope.mouseOverOther=function(){
					if(scope.isCityMouseOver==false && scope.isShopMouseOver==false){
						scope.isCityFocus = -1;
						scope.showFloatDiv = -1;
					}
					scope.isCityMouseOver = false;
					scope.isShopMouseOver = false;
				}
				
				/*鼠标移动到门店名称上时，将其高亮*/
				scope.highLightShop=function(id){
					/*若该门店已被选择，则不再添加高亮样式*/
					var highLightOption = true;
					scope.selectedShops.forEach(function(shop){
						if(shop.id==id){
							highLightOption = false;
							return;
						}
					});
					if(highLightOption==true){
						scope.isShopFocus = id;
					}
				}
				
				/*选择门店*/
				scope.choseShop = function(id){
					/*若该门店已被选择，则直接返回*/
					var shops = scope.selectedShops;
					for(var i=0;i<shops.length;i++){
						if(shops[i].id==id){
							return;
						}
					}
					scope.shopProvinces.forEach(function(province){
						var cities = province.cities;
						cities.forEach(function(city){
							var shops = city.shops;
							shops.forEach(function(shop){
								if(id==shop.id){
									shop.active = 1;
									/*给门店增加一个拼接而成的显示内容*/
									shop.showName = province.name + '/' + city.name + '/' + shop.name;
									scope.selectedShops.push(shop);
								}
							})
						})
					})
					/*选择门店后移除所有的高亮样式*/
					scope.isShopFocus = -1;
					/*当有门店处于选中状态时，用div替换select区域*/
					if(scope.selectedShops.length>0){
						scope.showShopSelectBox=-1;
					}
				}
				
				/*移除选中的门店*/
				scope.removeSelectedShop = function(id){
					scope.isShopOperateButton = true;
					var shops = scope.selectedShops;
					for(var i=0;i< shops.length;i++){
						if(shops[i].id==id){
							shops.splice(i, 1);
							scope.selectedShops = shops;
							break;
						}
					}
					/*恢复已移除的门店的样式*/
					scope.shopProvinces.forEach(function(province){
						var cities = province.cities;
						cities.forEach(function(city){
							var shops = city.shops;
							shops.forEach(function(shop){
								if(shop.id==id){
									shop.active = -1
									return;
								}
							})
						})
					})
					/*当所有选择的门店都被移除时，显示select区域*/
					if(scope.selectedShops.length<=0){
						scope.showShopSelectBox=1;
					}
				}
			}
		}
})