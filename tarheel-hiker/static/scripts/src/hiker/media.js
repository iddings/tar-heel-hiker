define(
    [
        "angular",
        "hiker/media/pano",
        "hiker/media/slide",
        "aframe"
    ], function(angular){
    
        var module = angular.module("hiker.media", [
            "hiker.media.slide",
            "hiker.media.pano"
        ]),
        
        collectionDirective = function($compile, $q){
            
            return {
                restrict: 'AE',
                scope: {
                    "collection": "="
                },
                link: function(scope, element) {
                    scope.$watch('collection', function(collection){
                        if (collection) {
                            var componentElement = angular.element('<media-' + collection.type.type + ' component="collection">');
                            element.html('');
                            element.append(componentElement);
                            $compile(componentElement)(scope);
                        }
                    });
                }
            };
        };
        
        module.directive('collection', collectionDirective);
        
        return module;
        
    }
    
);