routeApp.controller('RouteListCtl',function($scope) {
});
routeApp.controller('RouteDetailCtl',function($scope, $routeParams) {
    $scope.id = $routeParams.id;
});