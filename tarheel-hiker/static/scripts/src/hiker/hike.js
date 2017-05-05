define(['angular', 'ol', 'hiker/util', 'ngResource', 'hiker/map', 'hiker/media', 'hiker/rating'], function(angular, ol, util){
    
    var module = angular.module('hiker.hike', ['ngResource', 'hiker.map', 'hiker.media', 'hiker.rating']);
    
    var hikeLocationFilter = function(){
        return function(input) {
            return input ? input.city + ", " + (input.state || input.country) : "";
        };
    };
    
    var hikePageDirective = function(){
        return {
            restrict: 'E',
            template: util.html(
                '<div layout-fill layout="column">',
                '   <hike-toolbar></hike-toolbar>',
                '   <div flex layout="row">',
                '       <hike-sidenav></hike-sidenav>',
                '       <md-content layout-padding flex md-scroll-y layout-gt-sm="row">',
                '           <div layout="column" flex-gt-sm="50">',
                '               <div hide show-gt-sm class="md-padding" layout="column">',
                '                   <span class="md-display-1">{{ hike.title }}</span>',
                '                   <span class="md-headline">',
                '                       {{ hike.location | location }}',
                '                   </span>',
                '                   <rating ratings="hike.ratingCounts"></rating>',
                '               </div>',
                '               <div layout="column" flex-gt-sm layout-gt-sm="row">',
                '                   <div class="md-padding">',
                '                       <p ng-if="currentCollection === null" class="about-text pre-formatted">{{ hike.about }}</p>',
                '                       <div ng-if="currentCollection !== null" layout-padding>',
                '                           <div class="md-subhead" hide-gt-sm ng-bind="currentCollection.type.title"></div>',
                '                           <p class="about-text" ng-bind="currentCollection.type.about"></p>',
                '                           <div collection="currentCollection"></div>',
                '                       </div>',
                '                   </div>',
                '               </div>',
                '           </div>',
                '           <openlayers class="md-padding" flex-gt-sm="50" map="map"></openlayers>',
                '       </md-content>',
                '    </div>',
                '</div>'
            ),
            controller: function($scope, $location, $mdDialog, $mdSidenav, $q, $state, olMap, resource){
        
                var mapInitialized = false;
                
                $scope.$on("$stateChangeSuccess", function(event, state, params) {
                    $scope.hike = resource.Hike.get({hike: params.hike}, function(hike){
                        $scope.hike = hike;
                        if (!mapInitialized) {
                            map.setLocation({
                                latitude: hike.location.latitude,
                                longitude: hike.location.longitude
                            });
                            mapInitialized = true;
                        }
                        if (params.collection) {
                            var collectionIndex = parseInt(params.collection) - 1;
                            if (collectionIndex < hike.collections.length) {
                                $scope.currentCollection = hike.collections[collectionIndex];
                            }
                            else {
                                $state.transitionTo('hike.overview');
                            }
                        }
                        else {
                            $scope.currentCollection = null;
                        }
                    }, function failure(){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .title("Something went wrong...")
                                .textContent("We can't find the hike you've requested.")
                                .ok("home page")
                        ).then(function(){
                            $location.url("/");
                        })
                    });
                });
                
                var map = $scope.map = new olMap();
                
                $scope.nodeNavIsOpen = function(){
                    var nav = $mdSidenav('node-nav', true);
                    return nav.isOpen ? nav.isOpen() : false;
                };
                
                $scope.toggleNodeNav = function(){
                    $mdSidenav('node-nav').toggle();
                };
            }
        };
    },
    
    hikeToolbarDirective = function(){
        return {
            restrict: 'E',
            template: util.html(
                '<md-toolbar style="z-index: 100;">',
                '   <h1 class="md-toolbar-tools" layout="row">',
                '       <md-button aria-label="Open Menu" hide-gt-sm class="md-icon-button" ng-click="toggleNodeNav()">',
                '           <md-icon>',
                '               <ng-md-icon icon="{{ nodeNavIsOpen() ? \'arrow_back\' : \'menu\' }}"></ng-md-icon>',
                '           </md-icon>',
                '       </md-button>',
                '       <span hide show-gt-sm>Tar Heel Hiker</span>',
                '       <span hide-gt-sm ng-bind="hike.title"></span>',
                '   </h1>',
                '</md-toolbar>'
            )
        };
    },
    
    hikeSidenavDirective = function() {
        return {
            restrict: 'E',
            template: util.html(
                '<md-sidenav style="height: 100%;" class="md-sidenav-left" md-is-locked-open="$mdMedia(\'gt-sm\')"',
                '   md-whiteframe="4" md-component-id="node-nav">',
                '   <md-content layout="column" layout-fill>',
                '       <div hide-gt-sm md-colors="{\'background-color\': \'primary\'}">',
                '           <md-toolbar></md-toolbar>',
                '           <div class="md-padding" layout-padding>',
                '               <span class="md-title">{{ hike.location | location }}</span>',
                '               <rating ratings="hike.ratingCounts"></rating>',
                '           </div>',
                '       </div>',
                '       <md-list class="md-no-padding" ng-click="toggleNodeNav()">',
                '           <md-list-item aria-label="Hike Overview" ng-href="/hike/{{ hike.slug }}" ng-class="currentCollection === null ? \'active\' : \'\'">',
                '               Overview',
                '           </md-list-item>',
                '           <md-list-item aria-label="{{ node.title }}" ng-repeat="collection in hike.collections" ng-href="/hike/{{ hike.slug }}/{{ $index + 1 }}"',
                '               ng-class="collection === currentCollection ? \'active\' : \'\'">',
                '               <span ng-bind="collection.type.title"></span>',
                '           </md-list-item>',
                '       </md-list>',
                '       <span flex></span>',
                '       <md-button layout="row" class="md-no-margin" ui-sref="home">',
                '           <md-icon>',
                '               <ng-md-icon icon="home"></ng-md-icon>',
                '           </md-icon>',
                '           <span class="md-padding md-padding-h">Home</span>',
                '           <span flex></span>',
                '       </md-button>',
                '   </md-content>',
                '</md-sidenav>'
            )
        };
    },
    
    resourceService = function($resource){
        
        this.Hike = $resource('/h/:hike', {hike: '@id'}, {
            top: {
                method: 'GET',
                isArray: true,
                params: {hike: 'top'}
            }
        });
    
    };
    
    module.directive('hikePage', hikePageDirective)
        .directive('hikeSidenav', hikeSidenavDirective)
        .directive('hikeToolbar', hikeToolbarDirective)
        .filter('location', hikeLocationFilter)
        .service('resource', resourceService);
    
    return module;
    
});