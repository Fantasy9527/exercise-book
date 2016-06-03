define(["promotionApp"], function(promotionApp) {
  var app = promotionApp;
  app.directive("datepickerDir", function() {
    return {
      restrict: "A",
      scope: {},
      link: function(scope, element, attr) {
        element.on("change", function() {
          scope[attr.ngModel] = element.val();
          //console.log(scope[attr.ngModel])
        })
      }
    }
  })

  app.directive('backButton', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', goBack);
        function goBack() {
          window.history.back();
          scope.$apply();
        }
      }
    }
  });

})
