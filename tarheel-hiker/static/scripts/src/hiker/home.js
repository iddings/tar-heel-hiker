define(["angular", "hiker/util", "hiker/hike"], function(angular, util){
    
    var module = angular.module('hiker.home', []);
    
    var hikeHomeDirective = function(){
        return {
            restrict: 'E',
            template: util.html(
                
            )
        };
    };
    
    module.directive('hikeHome', hikeHomeDirective);
    
    return module;
    
});