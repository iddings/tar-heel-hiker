define(["angular", "hiker/util", "hiker/hike"], function(angular, util){
    
    var module = angular.module('hiker.home', ['hiker.hike']);
    
    var hikeHomeDirective = util.Component({
        template: util.html(
            '<div layout-fill layout="column">',
            '   <home-toolbar></home-toolbar>',
            '   <section layout="column" layout-align="start center">',
            '       <h2 class="md-title">Welcome to Tar Heel Hiker!</h2>',
            '       <div layout="row">',
            '           <span flex="5" flex-gt-xs="30"></span>',
            '           <span class="about-text md-padding">',
            '               Tar Heel Hiker is an open-source project; aiming to',
            '               make hikes around the world accessible to everyone.',
            '               Utilizing cutting edge WebVR technology, and the',
            '               ever-expanding capabilities of modern smartphones,',
            '               anyone can experience the wonder of hiking and nature',
            '               in an immersive virtual reality experience. Choose a',
            '               hike below to get started!',
            '           </span>',
            '           <span flex="5" flex-gt-xs="30"></span>',
            '       </div>',
            '   </section>',
            '   <home-top-hikes></home-top-hikes>',
            '</div>'
        )
    }),
        
    homeToolbarDirective = util.Component({
        controller: function($scope, $mdMedia){
            $scope.search = {
                active: false,
                term: ""
            };
            $scope.showTitle = function(){
                return !($scope.search.active || $scope.search.term) || $mdMedia('gt-xs');
            };
            $scope.showInput = function(){
                return !!($scope.search.active || $scope.search.term);
            }
        },
        template: util.html(
            '<md-toolbar>',
            '   <h1 class="md-toolbar-tools" layout="row">',
            '       <span flex class="slide-in" ng-show="showTitle()" show-gt-md>Tar Heel Hiker</span>',
            '       <span layout="row" layout-align="end center">',
            '           <md-button aria-label="Search" class="md-icon-button" ng-click="search.active = true">',
            '               <label style="cursor: inherit;" for="search">',
            '                   <md-icon>',
            '                       <ng-md-icon icon="search"></ng-md-icon>',
            '                   </md-icon>',
            '               </label>',
            '           </md-button>',
            '           <div ng-show="showInput()" class="slide-in" layout="row" layout-align="end center">',
            '               <md-input-container md-no-float class="no-errors">',
            '                   <input ng-focus="search.active = true" ng-blur="search.active = false" ng-model="search.term" placeholder="Search Hikes" id="search">',
            '               </md-input-container>',
            '               <md-button class="md-icon-button">',
            '                   <md-icon>',
            '                       <ng-md-icon icon="close"></ng-md-icon>',
            '                   </md-icon>',
            '               </md-button>',
            '           </div>',
            '       </span>',
            '   </h1>',
            '</md-toolbar>'
        )
    }),
        
    homeTopHikesDirective = util.Component({
        controller: function($scope, resource){
            $scope.topHikes = resource.Hike.top();
        },
        template: util.html(
            '<div layout="column" layout-align="space-between center" class="md-padding md-margin">',
            '   <div class="md-title">Top Hikes</div>',
            '   <md-list>',
            '       <md-list-item ui-sref="hike.overview({hike: hike.slug})" ng-repeat="hike in topHikes">{{ $index + 1 }}. {{ hike.title }}</md-list-item>',
            '       <md-list-item class="future-hike" ng-repeat="i in [1,2,3,4]">{{ topHikes.length + i }}. Future Hike</md-list-item>',
            '   </md-list>',
            '</div>'
        )
    });
      
    module.directive('hikeHome', hikeHomeDirective)
        .directive('homeToolbar', homeToolbarDirective)
        .directive('homeTopHikes', homeTopHikesDirective);
    
    return module;
    
});