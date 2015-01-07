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
    // var where = $filter('filter'); // filter フィルタ関数の取得

    // 行動の集まった1行のリスト
    $scope.lines = [createActionLine()] // 初期化

    function createActionLine() {
        return {
            actions: [],
            sumLevel: 0.0,
        };
    };

    $scope.addActionLine = function () {
        line = createActionLine();

        $scope.lines.push(line);
        $scope.editingLine = line; // 追加したlineを編集する
    };

    $scope.editingLine = null;

    $scope.addActionToLine = function (action) {
        if ($scope.editingLine === null) {
            alert("リストを選択してください");
            return; 
        }

        // editingLineにたいしてimgを追加
        $scope.editingLine.actions.push({
            imgSrc: action.src, 
            // data-*を取得: http://qiita.com/skinoshita/items/388eb277843e2d0c03de
            level: Number(action.dataset.level), // javascript (not jquery)
        });
    };

    $scope.editActionLine = function(line) {
        $scope.editingLine = line;
    };

    $scope.$watch('lines', function (lines) {
        if ($scope.editingLine != null) {
            // 難度の合計を計算
            var actions = $scope.editingLine.actions;
            var sum = 0;

            // TODO: angular.forEach
            for (var i = 0; i < actions.length; i++ ) {
                sum += actions[i].level;
            }

            $scope.editingLine.sumLevel = sum;
        }
    }, true);

    // lineの移動機能
    // 参考: http://qiita.com/matsuzan/items/6cd435cfa6418b86e0c7
    function moveLine(origin, destination) {
        // undefinedの比較: http://blog.tojiru.net/article/205007468.html
        if (!$scope.lines[destination]) {
            return;
        }

        var temp = $scope.lines[destination];

        $scope.lines[destination] = $scope.lines[origin];
        $scope.lines[origin] = temp;
    };

    // 右の操作パネル当たり
    $scope.createBefourLine = function(){            
        var index = $scope.lines.indexOf($scope.editingLine);
        if (index == -1 ) {
            return;
        }
        $scope.lines.splice(index, 0, createActionLine());
    };

    $scope.createAfterLine = function(){            
        var index = $scope.lines.indexOf($scope.editingLine);
        if (index == -1 ) {
            return;
        }
        $scope.lines.splice(index+1 , 0, createActionLine());
    };



    $scope.moveLineUp = function(){            
        // 同じ要素idを見つける:  http://stackoverflow.com/questions/20756694/angularjs-find-the-index-position-of-filtered-value-in-the-original-array
        var index = $scope.lines.indexOf($scope.editingLine);
        if (index == -1 ) {
            return;
        }
        moveLine(index, index - 1);
    };

    $scope.moveLineDown = function(){                    
        var index = $scope.lines.indexOf($scope.editingLine);
        if (index == -1 ) {
            return;
        }
        moveLine(index, index + 1);
    };

    $scope.removeLine = function () {
        // 要素が1個のときはデリートさせない
        if ($scope.lines.length == 1) {
            return; 
        }

        var index = $scope.lines.indexOf($scope.editingLine);
        if (index == -1 ) {
            return;
        }

        // http://www.gesource.jp/weblog/?p=4112
        $scope.lines.splice(index, 1);
    };
}]);
