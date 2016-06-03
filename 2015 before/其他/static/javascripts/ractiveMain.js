var layoutRactives = {};

var postData = function(url,data,fSuccess,fError){
	jQuery.ajax({
		url : url,
		type : "POST",
		dataType: "json",
      	contentType: "application/json; charset=utf-8",
      	data: JSON.stringify(data),
      	      	success : function(xhr, ajaxOptions, thrownError){
      		fSuccess(xhr);
      	}	,
      	error : function(xhr, ajaxOptions, thrownError){
      		fError(xhr);
      	}		
	});
};

var getData = function(url,data,fSuccess,fError){
	return jQuery.ajax({
		url : url,
		type : "GET",
		dataType: "json",
      	contentType: "application/json; charset=utf-8",      
      	success : function(xhr, ajaxOptions, thrownError){
      		fSuccess(xhr);
      	},
      	error : function(xhr, ajaxOptions, thrownError){
      		fError(xhr);
      	}		
	});
};

var updateBreadcrumb = function(bc){
      if(breadcrumbCtrl.ractive.data.bcs.length == 0){
            breadcrumbCtrl.ractive.push('bcs',bc);
      }else{
            var removeSize = breadcrumbCtrl.ractive.data.bcs.length - bc.level;
            breadcrumbCtrl.ractive.splice('bcs',bc.level,removeSize,bc);
      }
};

var contractDayLabels = function(obj){
      var label ='';
      if(obj.monday){
            label += '周一 ';
      }
      if(obj.tuesday){
            label += '周二 ';
      }
      if(obj.wednesday){
            label += '周三 ';
      }
      if(obj.thursday){
            label += '周四 ';
      }
      if(obj.friday){
            label += '周五 ';
      }
      if(obj.saturday){
            label += '周六 ';
      }
      if(obj.sunday){
            label += '周日 ';
      }

     label.slice(label.length-1,1);
     return label;
};

var convertDaysToArray = function(obj){
      var days =[];
      if(obj.monday){
            days.push('周一');
      }
      if(obj.tuesday){
            days.push('周二');
      }
      if(obj.wednesday){
            days.push('周三');
      }
      if(obj.thursday){
            days.push('周四');
      }
      if(obj.friday){
            days.push('周五');
      }
      if(obj.saturday){
            days.push('周六');
      }
      if(obj.sunday){
            days.push('周日');
      }

     return days;
};


var updateSubComponents = function(ractive){
      var components = ractive.findAllComponents();

      for(var i=0;i<components.length;i++){
            components[i].update();
      }
}

var weekDays = [{
            label : '周一',
            id : 'monday'
            },{
            label : '周二',
            id : 'tuesday'
            },{
            label : '周三',
            id : 'wednesday'
            },{
            label : '周四',
            id : 'thursday'
            },{
            label : '周五',
            id : 'friday'
            },{
            label : '周六',
            id : 'saturday'
            },{
            label : '周日',
            id : 'sunday'
            }];

