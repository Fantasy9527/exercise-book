define(["shopApp"], function(app) {
  	app.controller('configController',function($scope,$http,$timeout){
 		$scope.showAlert = -1;
 		$scope.showWarning = -1;
 		$scope.disableOption = -1;
		/*设置页面静态数据*/
		$scope.models = [
		{"groupId":"order","groupName":"点菜参数","keys":[
			{"keyId":"print_order","keyName":"落单打印点菜单","value":false,"is_open":1,"is_disable":false},
			{"keyId":"print_barcode","keyName":"点菜单打印条码","value":false,"is_open":1,"is_disable":false},
			{"keyId":"print_logo","keyName":"点菜单打印 Logo","value":false,"is_open":1,"is_disable":false},
			{"keyId":"use_big_font","keyName":"点菜单和前台退菜单使用大字体","value":false,"is_open":1,"is_disable":false},
			{"keyId":"print_notice_when_return_dish","keyName":"退菜时打印前台退菜单","value":true,"is_open":1,"is_disable":false},
			{"keyId":"auto_goto_cooking","keyName":"自动转入常用做法","value":false,"is_open":1,"is_disable":false}]},
		{"groupId":"round_type","groupName":"结账时的抹零方式", "uniqueSelected": true, "keys":[
			{"keyId":"round","keyName":"四舍五入到元", "remark":"例如 1.3 变成 1.0, 1.8 变成 2.0", "value":false,"is_open":1,"is_disable":false},
			{"keyId":"to_zero","keyName":"抹掉角", "remark":"例如 1.3 变成 1.0, 1.8 变成 1.0","value":false,"is_open":1,"is_disable":false},
			{"keyId":"to_one","keyName":"进一", "remark":"例如 1.3 变成 2.0, 1.8 变成 2.0","value":false,"is_open":1,"is_disable":false},
			{"keyId":"no_round","keyName":"不抹零","value":false,"is_open":1,"is_disable":false}]},
	  	{"groupId":"bill","groupName":"结账参数","keys":[
			{"keyId":"customer_receipt","keyName":"结账时打印收银单","value":false,"is_open":1,"is_disable":false},
			{"keyId":"reverse_print_bill","keyName":"反结账时打印当前账单","value":false,"is_open":1,"is_disable":false},
			{"keyId":"print_barcode","keyName":"预打单打印条码","value":false,"is_open":1,"is_disable":false},
			{"keyId":"print_logo","keyName":"预打单和结账单打印 Logo","value":false,"is_open":1,"is_disable":false}]},
		{"groupId":"print","groupName":"打印参数","keys":[
			{"keyId":"print_order_sn","keyName":"打印取餐号(适用于快餐，此时不打印餐桌号)","value":false,"is_open":1,"is_disable":false},
			{"keyId":"print_index","keyName":"厨打单打印序号","value":true,"is_open":1,"is_disable":false}]},
		{"groupId":"dayend","groupName":"日结参数","keys":[
			{"keyId":"print_dayend_detail","keyName":"允许重打日结单","value":true,"is_open":1,"is_disable":false}]},
		{"groupId":"query_by","groupName":"会员查询条件", "uniqueSelected": true, "keys":[
			{"keyId":"all","keyName":"不限(默认值)", "value":false,"is_open":1,"is_disable":false},
			{"keyId":"rfid","keyName":"必须刷会员实体卡", "value":false,"is_open":1,"is_disable":false}]},
		{"groupId":"member","groupName":"会员卡设置","keys":[
			{"keyId":"use_password","keyName":"会员卡消费时输入密码","value":false,"is_open":1,"is_disable":false}]}]

 	 	var getShopConfigsUrl = '/home/brand/'+ brandId + '/shop/' + shopId + '/configs';
		$http.get(getShopConfigsUrl).success(function(data){
		    $scope.brand = data.brand;
			var datas = data.shopConfigs;
			/*将后台获取的数据封装到models中 */
			$scope.models.forEach(function(model){
				var keys = model.keys;
				keys.forEach(function(k){
					datas.forEach(function(data){
						if(model.groupId==data.group && k.keyId==data.key){
							if(data.value=="1"){
								k.value=true;
							}else if(data.value=="0"){
								k.value=false;
							}
						}
						if(k.keyId == data.value){
							k.value = true
						}
					})
					if(model.groupId=="order" && k.keyId=="print_order" && k.value==false){
						$scope.disableOption = 1;
					}
					if((model.groupId=="order" && $scope.disableOption==1 && (k.keyId=="print_barcode" || k.keyId=="print_logo")) || (k.keyId=="print_logo" && $scope.brand.logo==undefined)){
						k.is_disable = true;
						k.value = false;
					}
				})
				model.keys = keys;
			})

			$scope.models.forEach(function(model){
				model.keys.forEach(function(k){
					datas.forEach(function(data) {
						if (k.keyId == data.value) {
							k.value = true
							return
						}
					})
				})
			})
		})

		$scope.choseCheckBox = function(model,key){
			if(model.groupId=="order" && key.keyId=="print_order"){
				$scope.models.forEach(function(model){
					var keys = model.keys;
					keys.forEach(function(k){
						if(model.groupId=="order" && (k.keyId=="print_barcode" || k.keyId=="print_logo") && key.value==true){
							k.is_disable = false;
							k.value = false;
						}else if(model.groupId=="order" && (k.keyId=="print_barcode" || k.keyId=="print_logo") && key.value==false){
							k.is_disable = true;
							k.value = false;
						}
						if(model.groupId=="order" && k.keyId=="print_logo" && $scope.brand.logo==undefined){
                            k.is_disable = true;
                            k.value = false;
                        }
					})
				})
			}
			selectedOne(model, key)
		}

		/**
		 * 根据参数判定每个group中只能选择一个key
		 * @param model
         * @param key
         */
		function selectedOne(model, key){
			if(model.uniqueSelected){
				if(key.value == false){
					key.value = true
				}
				model.keys.forEach(function(k){
					if(k.keyId != key.keyId){
						k.value = false
					}
				})
			}
		}

		function dealRoundType(postModels){
			for(var i=0;i<postModels.length;i++){
				if(postModels[i].group == "round_type"){
					postModels.splice(i,1)
					i--
				}
			}
			var roundType = {}
			roundType.group = "cashier"
			roundType.key = "round_type"
			roundType.open = 1
			$scope.models.forEach(function(model){
				if(model.groupId == "round_type"){
					model.keys.forEach(function(key){
						if(key.value){
							roundType.value = key.keyId
							return
						}
					})
					return
				}
			})
			return postModels.push(roundType)
		}

		function dealQueryBy(postModels){
			for(var i=0;i<postModels.length;i++){
				if(postModels[i].group == "query_by"){
					postModels.splice(i,1)
					i--
				}
			}
			var queryBy = {}
			queryBy.group = "member"
			queryBy.key = "query_by"
			queryBy.open = 1
			$scope.models.forEach(function(model){
				if(model.groupId == "query_by"){
					model.keys.forEach(function(key){
						if(key.value){
							queryBy.value = key.keyId
							return
						}
					})
					return
				}
			})
			return postModels.push(queryBy)
		}

		$scope.saveModel = function(){
			$scope.showWarning = 1
			/*将修改后的参数信息保存到后台*/
			var postShopConfigUrl = '/home/brand/' + brandId + '/shop/' + shopId + '/configs';
			/*将models中的数据封装为postModel*/
			var postModels = []
			var models = angular.copy($scope.models)
			models.forEach(function(model){
				var keys = model.keys
				keys.forEach(function(k){
					var shopConfig = {}
					shopConfig.group = model.groupId
					shopConfig.key = k.keyId
					if(k.value==true){
						shopConfig.value = "1"
					}else{
						shopConfig.value = "0"
					}
					shopConfig.open = 1
					postModels.push(shopConfig)
				})
			})
			dealRoundType(postModels)
			dealQueryBy(postModels)
			$http.post(postShopConfigUrl,postModels).success(function(data){
				$scope.showWarning = -1;
				$scope.showAlert = 1;
				$timeout(function(){
					$scope.showAlert = -1;
				},6000)
			})
		}

 	})

})
