define(
    [
        "angular",
        "hiker/media/pano",
        "aframe"
    ], function(angular){
    
        var module = angular.module("hiker.media", [
            "hiker.media.pano"
        ]),
        
        mediaDirective = function($compile, $q){
            
            return {
                restrict: 'AE',
                scope: {
                    "media": "="
                },
                link: function(scope, element) {
                    (scope.media.then ? scope.media : $q.resolve(scope.media)).then(function(media){
                        var componentElement = angular.element('<media-' + media.type + ' component="media">');
                        element.append(componentElement);
                        $compile(componentElement)(scope);
                    });
                }
            };
        };
        
        module.directive('media', mediaDirective);
        
        return module;
        
    }
    
);