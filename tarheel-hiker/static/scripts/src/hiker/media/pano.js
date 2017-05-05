define(["angular", "hiker/util", "aframe"], function(angular, util, aframe) {
    
    var module = angular.module('hiker.media.pano', []),
    
    panoDirective = function(){
        return {
            restrict: 'E',
            scope: {
                collection: "=component"
            },
            controller: function($scope, vr) {
                
                vr.attachCollection($scope.collection);
                
                $scope.enterVR = function(){
                    vr.enter();
                };
                
            },
            template: util.html(
                '<md-content>',
                '   <div layout="row" layout-align="start center">',
                '       <md-button class="md-primary" ng-click="enterVR()">',
                '           start hiking',
                '       </md-button>',
                '   </div>',
                '</md-content>'
            )
        };
    },
    
    vrService = function($mdDialog) {
        
        var self = this,
            scope, loaded = false, images, index, types;
        
        self.getIndex = function(){
            return index;
        };
        
        self.nImages = function(){
            return images.length;
        }
        
        self.setImage = function(i) {
            index = i;
            scope.currentPano = {
                src: images[i].src,
                type: types[i]
            };
        }
        
        
        self.enter = function(){
            
            self.setImage(0);
            
            if (loaded) {
                scope.enterVR();
            }
            else {
                $mdDialog.show({
                    clickOutsideToClose: false,
                    template: util.html(
                        '<md-dialog>',
                        '   <md-dialog-content style="overflow-y: hidden;" layout="row" class="md-padding" layout-align="start center">',
                        '       <md-progress-circular class="md-padding md-margin" md-radius="100"></md-progress-circular>',
                        '       <span class="md-padding">Loading VR Experience</span>',
                        '   </md-dialog-content>',
                        '</md-dialog>'
                    )
                });
            }
            
        }
        
        self.loaded = function(){
            
            if (loaded) return;
            
            loaded = true;
            
            $mdDialog.show({
                clickOutsideToClose: false,
                template: util.html(
                    '<md-dialog>',
                    '   <md-dialog-content class="md-padding">',
                    '       Please review the Daydream <a href="//g.co/daydream/SafetyWarrantyReq-Safety">Health Information</a>',
                    '       before using Virtual Reality.',
                    '   </md-dialog-content>',
                    '   <md-dialog-actions layout="row" layout-align="end">',
                    '       <md-button ng-click="cancel()" class="md-warn">Cancel</md-button>',
                    '       <md-button ng-click="confirm()" class="md-primary">Let\'s go!</md-button>',
                    '   </md-dialog-actions>',
                    '</md-dialog>'
                ),
                controller: function($scope) {
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                    $scope.confirm = function(){
                        $mdDialog.hide();
                        scope.enterVR();
                    }
                }
            });
            
        };
        
        self.exit = function(){
            
            scope.exitVR();
            
        };
        
        self.attachCollection = function(c) {
            
            loaded = false;
            
            images = [new Image()];
            types = [c.items[0].type];
            
            images[0].onload = function(){
                $mdDialog.hide();
                angular.forEach(c.items, function(item, index){
                    if (index === 0) return;
                    var image = new Image();
                    image.src = util.getMediaURL(item.filename);
                    types.push(item.type);
                    images.push(image);
                });
            };
            
            images[0].src = util.getMediaURL(c.items[0].filename);
            
        }
        
        self.attachDirectiveScope = function(s) {
            scope = s;
        };

        
    };
    
    var vrDirective = util.Component({
        
        scope: {},
        
        controller: function($scope, vr) {
            
            vr.attachDirectiveScope($scope);
            
            $scope.enterVR = function(){
                $scope.vrActive = true;
            };
            
            $scope.exitVR = function(){
                $scope.vrActive = false;
            };
            
            $scope.loaded = function(){
                vr.loaded();
            };
            
            $scope.back = function(){
                if (vr.getIndex() > 0) {
                    vr.setImage(vr.getIndex() - 1);
                }
            };
            
            $scope.next = function(){
                if (vr.getIndex() + 1 < vr.nImages()) {
                    vr.setImage(vr.getIndex() + 1);
                }
                else {
                    vr.exit();
                }
            };
            
        },
        
        link: function(scope, element) {
            
            var scene = element.children().eq(0),
                controls = scene.children().eq(2),
                sky = scene.children().eq(0),
                cylinder = scene.children().eq(1);
            
            angular.element(document.body).on('keyup', function(e) {
                if (scope.vrActive) {
                    if (e.keyCode === 37) {
                        scope.$apply(function(){
                            scope.back(); 
                        });
                    }
                    else if (e.keyCode === 39) {
                        scope.$apply(function(){
                            scope.next(); 
                        });
                    }
                }
            });
            
            scene.on('exit-vr', function(){
                scope.$apply(function(){
                    scope.vrActive = false;
                });
            });
            
            controls.on('buttonup', function(){
                scope.$apply(function(){
                    scope.next(); 
                });
            });
            
            scope.$watch('vrActive', function(value) {
                if (value === true) {
                    scene.attr('visible', true)[0].enterVR();
                }
                else if (value === false) {
                    scene.attr('visible', false)[0].exitVR();
                }
            });
            
            scope.$watch('currentPano', function(value) {
                if (!value) return;
                if (value.type === "pan3") {
                    cylinder.attr({'visible': false, src: null});
                    sky.on('materialtextureloaded', function(){
                        scope.loaded();
                        sky.off('materialtextureloaded');
                    });
                    sky.attr({
                        src: value.src,
                        visible: true
                    });
                }
                else if (value.type === "pan2") {
                    sky.attr({'visible': false, src: null});
                    cylinder.on('materialtextureloaded', function(){
                        scope.loaded();
                        cylinder.off('materialtextureloaded');
                    });
                    cylinder.attr({
                        src: value.src,
                        visible: true
                    });
                }
            });
            
        },
        
        template: util.html(
            '<a-scene visible="false">',
            '   <a-sky></a-sky>',
            '   <a-curvedimage position="0 1 0" scale="1 3 1"></a-curvedimage>',
            '   <a-entity daydream-controls></a-entity>',
            '   <a-camera wasd-controls="enabled: false"></a-camera>',
            '</a-scene>'
        )
    });
    
    
    var vrElement = angular.element("<vr></vr>");
    
    angular.element(document.body).append(vrElement);
    
    module.directive('mediaPano', panoDirective)
          .directive('vr', vrDirective)
          .service('vr', vrService);
    
    return module;
    
})