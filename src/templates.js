angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("features/_feature/_feature.html","");
$templateCache.put("features/home/_home.html","<div class=\"grid\">\n    <div class=\"row\" ng-repeat=\"row in grid | orderBy : index : reverse \" ng-init=\"y = $index\">\n        <span class=\"cell\" ng-repeat=\"cell in row.value track by $index\" ng-init=\"x = $index\">\n            <div class=\"patch\" ng-if=\"cell>1\"></div>\n            <div class=\"visited\" ng-if=\"cell==1\"></div>\n        </span>\n    </div>\n    <div class=\"roomba\"><span></span></div>\n</div>    \n<div class=meta>\n    <a class=\"button\" ng-class=\"{\'busy\': busy}\" ng-click=\"!busy && start(0)\" ng-bind=\"busy?\'Busy...\':\'Simulate\'\"></a>\n    <a class=\"button\" ng-class=\"{\'busy\': busy}\" ng-click=\"!busy && start(1)\" ng-bind=\"busy?\'Busy...\':\'Get On With It\'\"></a>\n</div>\n<a class=\"button button--minor\" ng-class=\"{\'busy\': busy}\" ng-click=\"!busy && another()\" ng-bind=\"busy?\'Busy...\':\'Another\'\"></a>");
$templateCache.put("patterns/_pattern/_pattern.html","");}]);