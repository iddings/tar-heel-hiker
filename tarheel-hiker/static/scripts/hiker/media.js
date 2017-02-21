define(["angular", "hiker/media/types"], function(angular){
    
    var module = angular.module("hiker.media", []);
    
    var mediaDirective = function(){
        return {
            restrict: 'AE',
            scope: {
                "media": "="
            },
            link: function(scope) {
                scope.templateUrl = "/asset/scripts/hiker/media/" + scope.media.type + ".html";
            },
            template: "<ng-include src='templateUrl'></ng-include>"
        };
    };
    
    module.directive('media', mediaDirective);
    
    return module;
    
});