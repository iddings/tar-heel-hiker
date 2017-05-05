define(["angular", "hiker/util"], function(angular, util) {
    
    var module = angular.module('hiker.media.slide', []),
    
    mediaSlideDirective = util.Component({
        scope: {
            collection: "=component"
        },
        controller: function($scope, slideshow) {
            slideshow.attachCollection($scope.collection);
            $scope.enterSlideshow = function(){
                slideshow.start();
            }
        },
        template: util.html(
                '<md-content>',
                '   <div layout="row" layout-align="start center">',
                '       <md-button class="md-primary" ng-click="enterSlideshow()">',
                '           start slideshow',
                '       </md-button>',
                '   </div>',
                '</md-content>'
            )
    });
    
    slideshowService = function($mdDialog, $timeout){
        
        var self = this,
            scope, firstImageIsLoaded, images, index;
        
        self.getIndex = function(){
            return index;
        };
        
        self.nImages = function(){
            return images.length;
        }
        
        self.setImage = function(i) {
            index = i;
            scope.currentImage = images[i].src;
        }
        
        self.start = function(){
            
            index = 0;
            
            if (!firstImageIsLoaded) {
                $mdDialog.show({
                    clickOutsideToClose: false,
                    template: util.html(
                        '<md-dialog>',
                        '   <md-dialog-content style="overflow-y: hidden;" layout="row" class="md-padding" layout-align="start center">',
                        '       <md-progress-circular class="md-padding md-margin" md-radius="100"></md-progress-circular>',
                        '       <span class="md-padding">Loading Slideshow</span>',
                        '   </md-dialog-content>',
                        '</md-dialog>'
                    )
                });
            }
            
            scope.slideshowActive = true;
            
            self.setImage(0);
            
        };
        
        self.exit = function(){
            
            scope.$apply(function(){
                scope.slideshowActive = false;
            });
            
        }
        
        angular.element(document.body).on('keyup', function(e) {
            if (scope.slideshowActive && e.keyCode === 27) {
                self.exit();
            }
        });
        
        self.attachCollection = function(c) {
            
            images = [new Image()];
            
            firstImageIsLoaded = false;
            
            images[0].onload = function(){
                firstImageIsLoaded = true;
                $mdDialog.hide();
                angular.forEach(c.items, function(item, index){
                    if (index === 0) return;
                    var image = new Image();
                    image.src = util.getMediaURL(item.filename);
                    images.push(image);
                });
            };
            
            images[0].src = util.getMediaURL(c.items[0].filename);
            
        }
        
        self.attachDirectiveScope = function(s) {
            scope = s;
            
        };

        
    };
    
    var slideshowDirective = util.Component({
        
        scope: {},
        
        controller: function($scope, slideshow){
            
            slideshow.attachDirectiveScope($scope);
            
            $scope.next = function(){
                slideshow.setImage((slideshow.getIndex() + 1) % slideshow.nImages());
            };
            
            $scope.back = function(){
                slideshow.setImage((slideshow.getIndex() === 0 ? slideshow.nImages() : slideshow.getIndex()) - 1);
            };
            
        },
        
        template: util.html(
            '<div class="slideshow" ng-show="slideshowActive">',
            '   <div hide show-gt-sm layout="row" layout-align="center center">',
            '       <div flex="grow" layout="row" layout-align="end">',
            '           <ng-md-icon ng-click="back()" size="38" icon="keyboard_arrow_left"></ng-md-icon>',
            '       </div>',
            '       <img ng-src="{{ currentImage }}">',
            '       <div flex="grow" layout="row" layout-align="start">',
            '           <ng-md-icon ng-click="next()" size="38" icon="keyboard_arrow_right"></ng-md-icon>',
            '       </div>',
            '   </div>',
            '   <div hide-gt-sm layout="column" layout-align="center center">',
            '       <div flex="90" class="md-padding">',
            '           <img ng-src="{{ currentImage }}">',
            '       </div>',
            '       <div flex="10" layout="row" layout-align="space-around">',
            '           <ng-md-icon ng-click="back()" size="38" icon="keyboard_arrow_left"></ng-md-icon>',
            '           <ng-md-icon ng-click="next()" size="38" icon="keyboard_arrow_right"></ng-md-icon>',
            '       </div>',
            '   </div>',
            '</div>'
        )
        
    });
    
    var slideshowElement = angular.element("<slideshow></slideshow>");
    
    angular.element(document.body).append(slideshowElement);
    
    module.directive('mediaSlide', mediaSlideDirective)
          .directive('slideshow', slideshowDirective)
          .service('slideshow', slideshowService);
    
    return module;
    
})