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
					/*�ж�ĳ�ε���¼��Ƿ����ڲ���div�е�button*/
					scope.isOperateButton = false;
					scope.showSelectArea = 1;
					
					/*�����еĳ������һ�����ԣ������ж��Ƿ�ѡ��*/
					scope.provinces.forEach(function(province){
						var cities = province.cities;
						cities.forEach(function(city){
							city.active = -1;
						})
					})
					/*���ػ���ʾѡ������*/
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
					
					/*����ƶ�������������ʱ���������*/
					scope.mouseOver=function(val){
						/*���ó����ѱ�ѡ�У�����Ӹ�����ʽ*/
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
					
					/*��ָ��id�ĳ��е�״̬��Ϊѡ��*/
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
					/*����id��ȡ����*/
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
					/*����idѡ�г���*/
					scope.selectCity=function(id){

						/*�ж��û�����ĳ����Ƿ���ѡ��*/
						var selectedCities = scope.selectedCities;
						for(var i=0;i<selectedCities.length;i++){
							/*��������Ǳ�ѡ��״̬��ֱ�ӷ���*/
							if(selectedCities[i].id==id){
								return;
							}
						}
						/*����ǰѡ��ĳ�����Ϊѡ��״̬*/
						scope.setCityActive(id);
						/*��ȡ��ǰѡ��ĳ���*/
						scope.getCityById(id);
						scope.selectedCities.push(scope.currentCity);
						/*�Ƴ����г��еĸ�����ʽ*/
						scope.isFocus = -1;
						/*���г��д���ѡ��״̬ʱ������ʾ��ѡ�г��е�div�滻input����*/
						if(scope.selectedCities.length>0){
							scope.showSelectArea=-1;
						}
					}
		
					
					/*����id�Ƴ�����*/
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
						/*�ָ����Ƴ��ĳ��е���ʽ*/
						scope.provinces.forEach(function(province){
							var cities = province.cities;
							cities.forEach(function(city){
								if(city.id == id){
									city.active = -1;
									return;
								}
							})
						})
						/*������ѡ��ĳ��ж����Ƴ�ʱ����ʾinput����*/
						if(scope.selectedCities.length<=0){
							scope.showSelectArea=1;
						}
					}
				}
		}
	})