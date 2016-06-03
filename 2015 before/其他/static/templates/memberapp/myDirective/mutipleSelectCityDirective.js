app.directive('mutipleSelectCity',function(){
		return {
			    templateUrl:'/assets/templates/memberapp/myDirective/mutipleSelectCityDirective.html',
				replace:true,
				transclude:true,
				scope:true,
				link:function(scope,element,attrs){
					scope.showingView = -1;
					scope.selectedCities = [];
					scope.isFocus = -1;
					/*判断某次点击事件是否是在操作div中的button*/
					scope.isOperateButton = false;
					scope.showSelectArea = 1;
					
					/*给所有的城市添加一个属性，用于判断是否选中*/
					scope.provinces.forEach(function(province){
						var cities = province.cities;
						cities.forEach(function(city){
							city.active = -1;
						})
					})
					/*隐藏或显示选择区域*/
					scope.showOrHideSelectArea=function(){
						if(scope.isOperateButton == false){
							if(scope.showingView == -1){
								scope.showingView = 1;
							}else if(scope.showingView == 1){
								scope.showingView = -1;
							}
						}
						scope.isOperateButton = false;
					}
					
					/*鼠标移动到城市名称上时，将其高亮*/
					scope.mouseOver=function(val){
						/*若该城市已被选中，则不添加高亮样式*/
						var highLightOption = true;
						scope.selectedCities.forEach(function(city){
							if(city.id==val){
								highLightOption = false;
							}
						});
						if(highLightOption==true){
							scope.isFocus = val;
						}
					}
					
					/*将指定id的城市的状态置为选中*/
					scope.setCityActive=function(id){
						scope.provinces.forEach(function(province){
							var cities = province.cities;
							cities.forEach(function(city){
								if(city.id == id){
									city.active = 1;
									return;
								}
							})
						})
					}
					
					scope.currentCity = {};
					/*根据id获取城市*/
					scope.getCityById=function(id){
						scope.provinces.forEach(function(province){
							province.cities.forEach(function(city){
								if(city.id==id){
									scope.currentCity = city;
									return;
								}
							})
						})
					}
					/*依据id选中城市*/
					scope.selectCity=function(id){

						/*判断用户点击的城市是否已选中*/
						var selectedCities = scope.selectedCities;
						for(var i=0;i<selectedCities.length;i++){
							/*如城市已是被选中状态，直接返回*/
							if(selectedCities[i].id==id){
								return;
							}
						}
						/*将当前选择的城市置为选中状态*/
						scope.setCityActive(id);
						/*获取当前选择的城市*/
						scope.getCityById(id);
						scope.selectedCities.push(scope.currentCity);
						/*移除所有城市的高亮样式*/
						scope.isFocus = -1;
						/*当有城市处于选中状态时，用显示已选中城市的div替换input区域*/
						if(scope.selectedCities.length>0){
							scope.showSelectArea=-1;
						}
					}
		
					
					/*依据id移除城市*/
					scope.removeSelectedCity = function(id){
						scope.isOperateButton = true;
						var cities = scope.selectedCities;
						for(var i=0;i< cities.length;i++){
							if(cities[i].id==id){
								cities.splice(i, 1);
								scope.selectedCities = cities;
								break;
							}
						}
						/*恢复已移除的城市的样式*/
						scope.provinces.forEach(function(province){
							var cities = province.cities;
							cities.forEach(function(city){
								if(city.id == id){
									city.active = -1;
									return;
								}
							})
						})
						/*当所有选择的城市都被移除时，显示input区域*/
						if(scope.selectedCities.length<=0){
							scope.showSelectArea=1;
						}
					}
				}
		}
	})