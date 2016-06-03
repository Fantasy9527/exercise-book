var components = [{
		id : 'sybtn',
		define : {
			template : '',
			data : {
				label : '', 
				onclick : '',
				bStyle : '',
				iStype : '',
				valid : true,
				disabled : false 
			},
			init : function(options){
				defaultComponentInitializer(options,this);
				mountEvent(options,'onclick',this,function(event){
					var names = this.data.onclick.split('.');
					controllers[names[0]][names[1]](event,this);
				});
			}
		}
	},{
		id : 'syinput',
		define : {
			template : '',
			data : {
				label : '',
				bindValue : '',
				errorMsg : '',
				numeric : false,
				length : undefined,
				max : undefined,
				min : undefined,
				pattern : undefined,
				valid : true,
				validator : 'inputValidate',
				require : false
			}
		}
	},{
		id : 'syemail',
		templateId : 'syinput',
		define : {
			template : '',
			data : {
				label : '',
				bindValue : '',
				errorMsg : '',
				numeric : false,
				length : undefined,
				valid : true,
				validator : 'emailValidate',
				require : false
			}			
		}
	},{
		id : 'sypasswd',
		define : {
			data : {
				label : '',
				bindValue : '',
				errorMsg : '',
				valid : true,
				require : false,
				validator : 'inputValidate'
			}
		}
	},{
		id : 'syDataGrid',
		define : {
			template : '',
			data : {
				columns : [],
				data : [],
				showIdCol : true,
				valid : true,
				cellclick : '',
				idCol : true	
			},
			init: function(options){
				defaultComponentInitializer(options,this);
				this.on('cellclick',function(event){
					var rowIndex = event.index.rowIndex;
					var colIndex = event.index.colIndex;
					if(this.data.cellclick){
						var names = this.data.cellclick.split('.');
						if(names.length==2){
							ctrlName = names[0];
							methodName = names[1];
							controllers[ctrlName][methodName](rowIndex,colIndex);
						}
					}
				});
			}
		}
	},{
		id : 'sySelect',
		define : {
			template : '',
			data : {
				options : [],
				bindValue : '',
				valid : true,
				require : false,
				validator : 'selectValidtor',
				valid : true,
				errorMsg : ''
			}
		}
	},{
		id : 'syform',
		define : {
			data : {
				validator : 'formValidate',
				submitable : ''
			}
		}
	},{
		id : 'sydatetimepicker',
		define : {
			data : {
				id : '',
				date : true,
				time : true,
				bindValue : '',
				require : false,
				validator : 'datetimepickerValidate',
				errorMsg : '',
				valid : true
			}			
		}
		
	},{
		id : 'sycheckboxs',
		define : {
			data : {
				items : [],
				bindValue : [],
				cols : 1,
				addCheckAllBox : false,
				selectAll : false,
				require : false,
				errorMsg : '',
				validator : 'checkboxsValidate',
			},
			init : function(options){
				defaultComponentInitializer(options,this);
				this.observe('items.*.selected',function(newValue,oldValue,keypath){
					var items = options.data.items;
					var selectedValue = [];
					for(var i=0;i<items.length ; i++){
						if(items[i].selected){
							selectedValue.push(items[i].value);
						}
					}
					this.set('bindValue',selectedValue);
				});
				this.observe('selectAll',function(newValue,oldValue,keyPath){
					var items = options.data.items;
					if(newValue){
						for(var i=0;i<items.length ; i++){
							this.set('items.'+i+'.selected',true);
						}
					}else {
						for(var i=0;i<items.length ; i++){
							this.set('items.'+i+'.selected',false);
						}
					}
				});
				componentValidators.checkboxsValidate(this.data.bindValue,this);
			}
		}
	},{
		id : 'syEditableDataGrid',
		define : {
			data : {
				id: '',
				columns : [],
				data : [],
				showIdCol : true,
				valid : true,
				useRowTemplate : true,
				validator : 'formValidate',
				editData : {},
				idCol : true,
				selectedIndex : 1,
				noEdit : true,
				edit : true,
				remove : true,
				add : true,
				onsave : '',
				ondelete : ''
			},
			beforeInit : function(options){
				var row='<tr>';
				var columns = options.data.columns;
				if(options.data.idCol){
					row = row + '<td>{{rowIndex+1}}</td>'
				}
				for(var i=0;i<columns.length ;i++){
					if(options.data.edit){
						row =row +'<td on-click="cellclick">';
					}else{
						row =row +'<td>';
					}
					if(columns[i].type=='weekday'){
						row = row + '<syweekdaypicker id=\'promotiondays_{{rowIndex}}\' bindValue=\'{{data[rowIndex]}}\' editable=false />';
					}else{
						row = row +'{{data[rowIndex].'+columns[i].id+'}}';
					}
					row = row +'</td>';
				}
				if(options.data.remove){
					row = row + '<td><a href="javascript:void(0);" on-click="delete">删除</a></td>';
				}else{
					row = row + '<td></td>';
				}
				row=row + '</tr>';
				options.partials.normalRow = row;

				if(options.data.useRowTemplate){
					options.partials.editableRow = '{{>editableRow_'+options.data.id+'}}';
				}else{
					row = '<tr>';
					if(options.data.idCol){
						row = row +'<td></td>';
					}
					for(var i=0;i<columns.length ;i++){
						row = row + '<td>';
						if(columns[i].type=='input'){
							row = row +'<syinput bindValue=\'{{editData.'+columns[i].id+'}}\'/>';
						}else if(columns[i].type=='select'){
							row = row+'<sySelect options=\'{{'+columns[i].options+'}}\' bindValue=\'{{editData.'+columns[i].id+'}}\' />';
						}else if(columns[i].type=='date'){
							row = row +'<sydatetimepicker id=\''+this.data.id+columns[i].id+'\' time=false bindValue=\'{{editData.'+columns[i].id+'}}\'/>';
						}else if(columns[i].type=='time'){
							row = row +'<sydatetimepicker id=\''+this.data.id+columns[i].id+'\' date=false bindValue=\'{{editData.'+columns[i].id+'}}\'/>';
						}else if(columns[i].type=='datetime'){
							row = row +'<sydatetimepicker id=\''+this.data.id+columns[i].id+'\' bindValue=\'{{editData.'+columns[i].id+'}}\' />';
						}else if(columns[i].type=='checkboxs'){
							row = row +'<sycheckboxs id=\''+this.data.id+columns[i].id+'\' bindValue=\'{{editData.'+columns[i].id+'}}\' items=\'{{'+columns[i].options+'}}\' vertical=true />';
						}else if(columns[i].type=='weekday'){
							 row = row + '<syweekdaypicker id=\''+this.data.id+columns[i].id+'\' bindValue=\'{{editData}}\' editable=true />';
						}else{
							row = row +'<label>&nbsp;</label><div>{{editData.'+columns[i].id+'}}</div>';
						}
						row = row +'</td>';
					}

					if(options.data.edit || options.data.add){
						row = row + '<td><label>&nbsp;</label><div><a href="javascript:void(0);" on-click="save">保存</a></div></td>';
					}else{
						row = row + '<td></td>';
					}
					row = row +'</tr>';

					options.partials.editableRow = row;
				}
				if(options.data.add){
					var cols = options.data.columns.length+1;
					if(options.data.idCol){
						cols=cols+1;
					}

					row ='<tr on-click="add"><td  colspan="'+cols+'">点击增加</td></tr>';
				}
				options.partials.emptyRow = row;

			},
			init : function(options){
				defaultComponentInitializer(options,this);
				if(options.data.add){
					this.on('add',function(event){
						editData = { selected : true};
						this.push('data',editData);
						this.set('noEdit',false);
					});
				}
				if(options.data.save){
					this.on('cellclick',function(event){
						var rowIndex = event.index.rowIndex;
						var colIndex = event.node.cellIndex;
						if(this.data.idCol){
							colIndex = colIndex -1;
						}

						if(this.data.columns[colIndex].action && this.data.cellclick){
							var names = this.data.cellclick.split('.');
							ctrlName = names[0];
							methodName = names[1];
							controllers[ctrlName][methodName](rowIndex,colIndex);		
						}else{
							for(var i=0 ;i<this.data.data.length;i++){
								this.data.data[i].selected=false;
							}
							this.data.data[rowIndex].selected=true;
							this.set('editData',this.data.data[rowIndex]);
							this.set('editData.'+rowIndex+'.selected',true);
							this.set('noEdit',false);
							this.update();
						}		
					});					
				}else{
					this.on('cellclick',function(event){
						var rowIndex = event.index.rowIndex;
						var colIndex = event.node.cellIndex;
						if(this.data.idCol){
							colIndex = colIndex -1;
						}

						if(this.data.columns[colIndex].action && this.data.cellclick){
							var names = this.data.cellclick.split('.');
							ctrlName = names[0];
							methodName = names[1];
							controllers[ctrlName][methodName](rowIndex,colIndex);		
						}
					});
				}

				mountEvent(options,'onsave',this,function(event){
					var names = this.data.onsave.split('.');
					controllers[names[0]][names[1]](event,this);
				});

				mountEvent(options,'ondelete',this,function(event){
					var names = this.data.ondelete.split('.');
					controllers[names[0]][names[1]](event,this);
				});
			}
		}
	},{
		id : 'syweekdaypicker',
		define : {
			data : {
				id : 'weekdaypicker',
				label : '',
				bindValue : {
					monday: false,
					tuesday: false,
					wednesday: false,
					saturday: false,
					friday: false,
					sunday: false,
					thursday: false
				},
				editable : true,
				require : false,
				valid : true,
				validator : 'weekdaypickerValidate',
				errorMsg : ''
			},
			init : function(options){
				defaultComponentInitializer(options,this);
				this.on('click',function(event){
						if(this.data.editable){
						var keyPath = 'bindValue.'+event.node.id.replace(this.data.id+'_','');
						var value = this.get(keyPath);
						this.set(keyPath, !value);
					}
				});
				componentValidators.weekdaypickerValidate(this.data.bindValue,this);
			}
		}
	}];

var componentValidators = {
	inputValidate : function(value,obj){
		obj.set('valid',true);
		obj.set('errMsg','');	
		if(obj.data.required && obj.data.bindValue.length==0){
			obj.set('valid',false);
			return messages.getMessage('error.required',[obj.data.label]);
		}
				if(obj.data.length && value.length>obj.data.length){
					obj.set('valid',false);
					return messages.getMessage('error.input.tooLong',[obj.data.length]);
				}
				if(obj.data.numeric){
					if (isNaN(value)){
						return messages.getMessage('error.input.numeric');
					}
					if(obj.data.max && value>obj.data.max){
						return messages.getMessage('error.input.tooBig',[obj.data.max]);
					}
					if(obj.data.min && value<obj.data.min){
						return messages.getMessage('error.input.tooLess',[obj.data.min]);
					}
				}
				if(obj.data.pattern && ! new RegExp(obj.data.pattern).match(value)){
					return messages.getMessage('error.input.invalid');
				}
				return undefined;
			},
	emailValidate : function(value,obj){
		obj.set('valid',true);
		obj.set('errMsg','');
		if(obj.data.required && obj.data.bindValue.length==0){
			obj.set('valid',false);
			return messages.getMessage('error.required',[obj.data.label]);
		}
		if(obj.data.length && value.length>obj.data.length){
			return messages.getMessage('error.input.tooLong',[obj.data.length]);
		}
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(! re.test(value)){
			return messages.getMessage('error.input.invalid');
		}
		return undefined;
	},
	checkboxsValidate : function(value,obj){
		obj.set('valid',true);
		obj.set('errMsg','');
		if(obj.data.required && obj.data.bindValue.length==0){
			obj.set('valid',false);
			return messages.getMessage('error.required',[obj.data.label]);
		}
	},
	selectValidtor : function(value,obj){
		obj.set('valid',true);
		obj.set('errMsg','');
		if(obj.data.required && obj.data.bindValue.length==0){
			obj.set('valid',false);
			return messages.getMessage('error.required',[obj.data.label]);
		}
	},
	datetimepickerValidate : function(value,obj){
		obj.set('valid',true);
		obj.set('errMsg','');
		if(obj.data.required && obj.data.bindValue.length==0){
			obj.set('valid',false);
			return messages.getMessage('error.required',[obj.data.label]);
		}
	},
	weekdaypickerValidate : function(value,obj){
		obj.set('valid',true);
		obj.set('errMsg','');
		if(obj.data.required&& !(obj.data.bindValue.monday || obj.data.bindValue.tuesday 
			|| obj.data.bindValue.wednesday || obj.data.bindValue.saturday || obj.data.bindValue.friday 
			|| obj.data.bindValue.sunday || obj.data.bindValue.thursday)){
			obj.set('valid',false);
			return messages.getMessage('error.required',[obj.data.label]);
		}
	},
	formValidate : function(obj){
		var elements = obj.findAllComponents();
		var valid = true;
		var submitBtn ;
		for(var i=0;i<elements.length;i++){
			var e = elements[i];
			if(!e.data.valid){
				valid = false;
			}
			if(e.data.id && e.data.id=='submit'){
				submitBtn=e;
			}
		}

		if(submitBtn){
			submitBtn.set('disabled',!valid);
		}
	}
};
var loadComponent = function(component){
	var componentId = component.id;
	var templateId = component.id;
	if(component.templateId ){
		templateId = component.templateId;
	}
	jQuery.ajax({
		url : '/assets/templates/components/'+templateId+'.html',
		type : 'GET',
		success : function(respData,status,jqxHR){
			//将加载到的模版内容设置到对应字段中
			component.define.template = respData;
			if(component.define.init == undefined){
	   			component.define.init = function(args){
					defaultComponentInitializer(args,this);
				};
			}
			var rac = Ractive.extend(component.define);
			Ractive.components[componentId] = rac;
		}
	});
};	

var defaultComponentInitializer= function(args,ractive){
	if(ractive.data.validator){
					//注册校验函数
		ractive.on('change',function(value){
			var validator = componentValidators[ractive.data.validator];
			var changedInBindValue = false;
			for(var path in value){
				if(path.indexOf('bindValue')>=0){
					changedInBindValue = true;
				}
			}
					
			if(validator){
				if(ractive.data.bindValue && changedInBindValue){					
					ractive.data.valid=true;
					ractive.set('errorMsg','');
					var errMsg = validator(value.bindValue,ractive);
					if(errMsg){
						ractive.data.valid=false;
						ractive.set('errorMsg',errMsg);
					}
				}else if(ractive.data.submitable){
					validator(ractive);
				}
			}						
		});		
	}
	
	//注册用户添加的事件实现，属性命名以on开头，内容为 controllername.methodname
	// for(var propName in args.data){
	// 	if ( propName.indexOf('on')==0){
	// 		var propValue = args.data[propName];
	// 		if(typeof propValue == 'string'){
	// 			var names = args.data[propName].split('.');
	// 			ctrlName = names[0];
	// 			methodName = names[1];
	// 			ractive.on(propName.substring(2),function(event){								
	// 				controllers[ctrlName][methodName](event,this);
	// 			});
	// 		}
	// 	}
	// }
	
	if(args.data.required){
		var validator = componentValidators[ractive.data.validator];
		var errMsg = validator(args.data.bindValue,ractive);
		if(errMsg){
			ractive.data.valid=false;
			ractive.set('errorMsg',errMsg);
		}
	}
};

var mountEvent = function(options,eventPropName,ractive,fn){
	if(options.data[eventPropName]!=undefined ){
		var names = options.data[eventPropName].split('.');
		if(names.length==2){
			ractive.on(eventPropName.substring(2),fn);	
		}
	}
};

var loadedComponents = {};

for(var i=0;i<components.length;i++){
	loadComponent(components[i]);
	loadedComponents[components[i].id]=components[i];
}

var loadComponent1 = function(componentId,templateId,data){
	jQuery.ajax({
		url : '/assets/templates/components/'+templateId+'.html',
		type : 'GET',
		success : function(respData,status,jqxHR){
			//将加载到的模版内容设置到对应字段中
			var rac = Ractive.extend({
				'template' : respData,
				'data' : data
			});
			Ractive.components[componentId] = rac;
		}
	});
};	

loadComponent1("popField","popField",{
	content : '',
	title : '',
	placement : 'top',
	id : ''
});