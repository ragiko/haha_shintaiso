angular.module('App', ['ngSanitize'])
.directive('mySelect', [function () {
  return function (scope, $el, attrs) {
    // scope - 現在の $scope オブジェクト
    // $el   - jqLite オブジェクト(jQuery ライクオブジェクト)
    //         jQuery 使用時なら jQuery オブジェクト
    // attrs - DOM 属性のハッシュ(属性名は正規化されている)

    scope.$watch(attrs.mySelect, function (val) {
      if (val) {
        $line = $el;
        $line.css("border", "solid 3px black");
      }
    });
  };
}])
.directive('imgClick', [function () {
  return function ($scope, $el, attrs) {
    $el.on('click', function () {
        var action = $el[0];
        $scope.addActionToLine(action);

        // 外部で読んだときにrendorする
        // 参考: https://docs.angularjs.org/guide/accessibility
        $scope.$apply(); 
    });
  };
}])
.controller('MainController', ['$scope', '$filter', function ($scope, $filter) {
    var where = $filter('filter'); // filter フィルタ関数の取得

    // 一つ一つの行動
    $scope.actions = [];

    $scope.addAction = function (img) {
        $scope.actions.push({
            img: img 
        });
    };

    // 行動の集まった1行のリスト
    $scope.lines = [createActionLine()] // 初期化

    function createActionLine() {
        return {
            actions: [],
            done: false,
            sumLevel: 0.0,
        };
    }

    $scope.editingLine = null;

    $scope.editActionLine = function(line) {
        $scope.editingLine = line;
    }

    $scope.addActionToLine = function (img) {
        if ($scope.editingLine === null) {
            alert("リストを選択してください");
        }

        // editingLineにたいしてimgを追加
        $scope.editingLine.actions.push({
            img: img 
        });

        // var a = where($scope.lines, $scope.filter.editActionLine);

        // console.log(a);
    };


}]);
