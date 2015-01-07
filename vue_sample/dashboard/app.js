angular.module('App', ['ngSanitize'])
.directive('imgClick', [function () {
  return function ($scope, $el, attrs) {
    $el.on('click', function () {
        var action = $el[0];
        $scope.addAction(action);

        // 外部で読んだときにrendorする
        // 参考: https://docs.angularjs.org/guide/accessibility
        $scope.$apply(); 
    });
  };
}])
.controller('MainController', ['$scope', function ($scope) {
    $scope.actions = [];

    $scope.addAction = function (img) {
        $scope.actions.push({
            img: img 
        });
    };

}]);
