define(["angular", "hiker/util"], function(angular, util) {
    
    var module = angular.module('hiker.media.pano', []),
    
    panoDirective = function(){
        return {
            restrict: 'E',
            scope: {
                media: "=component"
            },
            controller: function($scope, vr) {
                
                $scope.getMediaURL = util.getMediaURL;
                
                $scope.enterVR = function(){
                    vr.enter($scope.media);
                };
                
            },
            template: [
                '<md-content>',
                '   <div layout="row" layout-align="start center">',
                '       <span>360&deg; Panorama</span>',
                '       <span flex></span>',
                '       <md-button class="md-icon-button" ng-click="showViewer()">',
                '           <md-icon>',
                '               <ng-md-icon icon="image"></ng-md-icon>',
                '           </md-icon>',
                '       </md-button>',
                '       <md-button class="md-icon-button" ng-click="enterVR()">',
                '           <md-icon>',
                '               <ng-md-icon icon="google-cardboard"></ng-md-icon>',
                '           </md-icon>',
                '       </md-button>',
                '   </div>',
                '</md-content>'
            ].join('')
        };
    },
    
    vrService = function($compile, $mdDialog, $rootScope) {
        
        var self = this,
        
        parent = angular.element(document.body),
        
        scene = angular.element([
            '<a-scene vr-mode-ui="enabled: false;">',
            '   <a-sky ng-src="{{ panoUrl }}"></a-sky>',
            '</a-scene>'
        ].join('')),
        
        sky = scene.children().eq(0);

        scene.css('display', 'none');
        
        parent.append(scene);
        
        scene.on('exit-vr', function(){
            scene.css('display', 'none');
        })
        .on('enter-vr', function(){
            scene.css('display', 'block');
        });
        
        self.enter = function(media) {
            
            sky.attr({
                src: util.getMediaURL(media.filename),
                visible: "false"
            });
            
            $mdDialog.show({
                clickOutsideToClose: false,
                template: [
                    '<md-dialog>',
                    '   <md-dialog-content style="overflow-y: hidden;" layout="row" class="md-padding" layout-align="start center">',
                    '       <md-progress-circular class="md-padding md-margin" md-radius="100"></md-progress-circular>',
                    '       <span class="md-padding">Loading VR Experience</span>',
                    '   </md-dialog-content>',
                    '</md-dialog>'
                ].join('')
            });
              
            sky.on("materialtextureloaded", function(){
                sky.attr("visible", "true");
                $mdDialog.show({
                    clickOutsideToClose: false,
                    template: [
                        '<md-dialog>',
                        '   <md-dialog-content class="md-padding">',
                        '       This is a placeholder for the VR disclaimer.', // TODO: actual disclaimer
                        '   </md-dialog-content>',
                        '   <md-dialog-actions layout="row" layout-align="end">',
                        '       <md-button ng-click="cancel()" class="md-warn">Cancel</md-button>',
                        '       <md-button ng-click="confirm()" class="md-primary">Let\'s go!</md-button>',
                        '   </md-dialog-actions>',
                        '</md-dialog>'
                    ].join(''),
                    controller: function($scope) {
                        $scope.cancel = function(){
                            $mdDialog.hide();
                        };
                        $scope.confirm = function(){
                            $mdDialog.hide();
                            scene[0].enterVR();
                        }
                    }
                });
                sky.off("materialtextureloaded");
            });
            
        };
        
    };
    
    module.directive('mediaPano', panoDirective)
          .service('vr', vrService);
    
    return module;
    
})