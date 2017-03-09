define(["angular", "hiker/util", "ngMdIcons"], function(angular, util) {
    
    var module = angular.module('hiker.rating', ['ngMdIcons']);
    
    var ratingDirective = function($timeout){
        
        var MAX_RATING = 5,
            MIN_RATING = 1;
        
        return {
            restrict: 'E',
            scope: {
                rating: "=stars",
                ratingArray: "=ratings"
            },
            link: function(scope, element){
                
                var sanitizeRating = function(rating) {
                    return Math.max(Math.min(rating, MAX_RATING), MIN_RATING);
                };
                
                scope.starIcons = [];
                
                scope.$watchGroup(["rating", "ratingArray"], function(ratingSources) {
                    
                    var rating = ratingSources[0],
                        ratingArray = ratingSources[1];
                        
                    if (ratingArray) {
                        rating = ratingArray.reduce(function(rating, currentCount, currentIndex){
                            return rating + currentCount * (currentIndex + 1);
                        }) / ratingArray.reduce(function(count, currentCount) {
                            return count + currentCount;
                        });
                    }
                    
                    scope.disabled = isNaN(rating);
                    
                    if (scope.disabled) {
                        rating = MAX_RATING;
                    }
                    
                    rating = sanitizeRating(rating);
                    
                    var rounded = Math.round(rating * 2)/2,
                    hasHalf = (rounded % 1 !== 0),
                    largestWholeStar = rounded - (hasHalf * 0.5);
                    
                    for (var i=1, icon; i<=MAX_RATING; i++) {
                        if (i <= largestWholeStar) {
                            icon = "star";
                        }
                        else if (i == largestWholeStar + 1 && hasHalf) {
                            icon = "star_half";
                        }
                        else {
                            icon = "star_border";
                        }
                        scope.starIcons[i-1] = icon;
                    }
                    
                });
                
            },
            template: util.html(
                '<div class="rating" layout="row" layout-align="start start" ng-class="{disabled: disabled}">',
                '   <ng-md-icon class="md-no-margin" ng-repeat="icon in starIcons track by $index"',
                '       options=\'{"duration": 1}\' index="{{ $index }}" icon="{{ icon }}">',
                '   </ng-md-icon>',
                '   <span flex></span>',
                '</div>'
            ),
            replace: true
        };
        
    };
    
    module.directive('rating', ratingDirective);
    
})