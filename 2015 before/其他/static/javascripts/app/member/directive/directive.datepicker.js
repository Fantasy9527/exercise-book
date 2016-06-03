app.directive('datepicker', function() {
    return function(scope, element, attrs) {
        element.datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        }).on('changeDate', function(dateText) {
            var date = element[0].value;
            var modelPath = $(this).attr('ng-model');
            scope.bindToAddingModel(modelPath, date);
            scope.$apply();

        })
    }
})
