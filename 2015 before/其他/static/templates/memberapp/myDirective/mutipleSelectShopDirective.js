app.directive('shop',function(){
		return {
			    templateUrl:'/assets/templates/memberapp/myDirective/mutipleSelectCityDirective.html',
				replace:true,
				transclude:true,
				scope:true,
				link:function(scope,element,attrs){

				/*����������ѡ��*/
				scope.showingShopView = -1;
				scope.selectedShops = [];
				scope.isShopFocus = -1;
				/*��ʾ�ŵ�ѡ�񸡶���*/
				scope.showFloatDiv = -1;
				/*�ж�ĳ�ε���¼��Ƿ����ڲ���div�е�button*/
				scope.isShopOperateButton = false;
				
				/*�ж�ĳ��mouseOver�Ƿ������ڳ����ϵ�*/
				scope.isCityMouseOver = false;
				/*�ж�ĳ��mouseOver�Ƿ��������ŵ��ϵ�*/
				scope.isShopMouseOver = false
				
				scope.showShopSelectBox = 1;
				
				
				/*���ػ���ʾѡ������*/
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
				
				
				/*��ʾ�ŵ�ѡ������*/
				scope.showShopSelectArea=function(id){
					scope.showFloatDiv = id;
					scope.isShopMouseOver = true;
				}
				
				/*����ƶ�������������ʱ���������������ʾ�ŵ�ѡ�񸡶���*/
				scope.mouseOverCity=function(val){
					scope.isCityFocus = val;
					scope.showFloatDiv = val;
					scope.isCityMouseOver=true;
				}
				
				
				/*����ƶ����ǳ��з��ŵ�����ʱ���Ƴ����еĸ���*/
				scope.mouseOverOther=function(){
					if(scope.isCityMouseOver==false && scope.isShopMouseOver==false){
						scope.isCityFocus = -1;
						scope.showFloatDiv = -1;
					}
					scope.isCityMouseOver = false;
					scope.isShopMouseOver = false;
				}
				
				/*����ƶ����ŵ�������ʱ���������*/
				scope.highLightShop=function(id){
					/*�����ŵ��ѱ�ѡ��������Ӹ�����ʽ*/
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
				
				/*ѡ���ŵ�*/
				scope.choseShop = function(id){
					/*�����ŵ��ѱ�ѡ����ֱ�ӷ���*/
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
									/*���ŵ�����һ��ƴ�Ӷ��ɵ���ʾ����*/
									shop.showName = province.name + '/' + city.name + '/' + shop.name;
									scope.selectedShops.push(shop);
								}
							})
						})
					})
					/*ѡ���ŵ���Ƴ����еĸ�����ʽ*/
					scope.isShopFocus = -1;
					/*�����ŵ괦��ѡ��״̬ʱ����div�滻select����*/
					if(scope.selectedShops.length>0){
						scope.showShopSelectBox=-1;
					}
				}
				
				/*�Ƴ�ѡ�е��ŵ�*/
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
					/*�ָ����Ƴ����ŵ����ʽ*/
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
					/*������ѡ����ŵ궼���Ƴ�ʱ����ʾselect����*/
					if(scope.selectedShops.length<=0){
						scope.showShopSelectBox=1;
					}
				}
			}
		}
})