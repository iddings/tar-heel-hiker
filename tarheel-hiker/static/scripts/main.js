requirejs(
    [
        'angular',
        'ngMaterial',
        'ngMdIcons',
        'ui.router',
        'hiker/home'
    ],
    function(angular){
        
        angular.module('hiker', ['ngMaterial', 'ngMdIcons', 'ui.router', 'hiker.home'])
            .config(function($locationProvider, $stateProvider, $urlMatcherFactoryProvider){
                
                var createTemplateUrl = function(name) {
                    return '/asset/scripts/hiker/'+name+'.html';
                };
                
                $urlMatcherFactoryProvider.strictMode(false)
                
                $stateProvider
                    .state('home', {
                        url: '/',
                        templateUrl: createTemplateUrl('home')
                    })
                    .state('hike', {
                        url: '/hike',
                        templateUrl: createTemplateUrl('hike'),
                        controller: 'hikeController',
                        abstract: true
                    })
                    .state('hike.overview', {
                        url: '/:hike',
                        controller: 'hikeController',
                        controllerAs: 'hikeCtrl'
                    })
                    .state('hike.node', {
                        url: '/:hike/:node',
                        controller: 'hikeController',
                        controllerAs: 'hikeCtrl'
                    });
                
                $locationProvider.html5Mode(true);
                
            });
        
        angular.bootstrap(document, ['hiker']);
        
    }
);