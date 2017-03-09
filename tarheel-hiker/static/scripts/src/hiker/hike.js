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
                '       <md-content layout-padding flex md-scroll-y layout="column" layout-gt-sm="row">',
                '           <div layout="column" flex="50">',
                '               <div hide show-gt-sm class="md-padding" layout="column">',
                '                   <span class="md-display-1">{{ hike.title }}</span>',
                '                   <span class="md-headline">',
                '                       {{ hike.location | location }}',
                '                   </span>',
                '                   <rating ratings="hike.ratingCounts"></rating>',
                '               </div>',
                '               <div layout="column" flex layout-gt-sm="row">',
                '                   <div class="md-padding">',
                '                       <div ng-if="!currentNode" class="plain-text">{{ hike.about }}</div>',
                '                       <div ng-if="currentNode" layout-padding>',
                '                           <div class="md-subhead">Explore <i hide-gt-sm ng-bind="currentNode.title"></i></div>',
                '                           <div>',
                '                               <div media="media" ng-repeat="media in currentNode.media"></div>',
                '                           </div>',
                '                       </div>',
                '                   </div>',
                '               </div>',
                '           </div>',
                '           <openlayers class="md-padding" flex="50" map="map"></openlayers>',
                '       </md-content>',
                '    </div>',
                '</div>'
            ),
            controller: function($scope, $mdSidenav, $q, $state, olMap, resource){
        
                var mapInitialized = false;
                
                $scope.$on("$stateChangeSuccess", function(event, state, params) {
                    $scope.hike = resource.Hike.get(params.hike).then(function(hike){
                        $scope.hike = hike;
                        if (!mapInitialized) {
                            $q.all(hike.nodes.map(function(n, index){
                                return hike.getNode(index);
                            })).then(function(nodes){
                                map.setNodes(nodes);
                                map.zoomToNodes();
                            });
                            mapInitialized = true;
                        }
                        if (params.node) {
                            if (hike.nodeIds.indexOf(params.node) != -1) {
                                $scope.currentNode = resource.Node.get(params.node).then(function(node){
                                    $scope.currentNode = node;
                                    map.setActiveNode(node);
                                });
                            }
                            else {
                                $state.transitionTo('hike', {node: undefined}, { notify: false });
                            }
                        }
                        else {
                            $scope.currentNode = null;
                            map.setActiveNode();
                        }
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
                '   <md-content>',
                '       <div hide-gt-sm md-colors="{\'background-color\': \'primary\'}">',
                '           <md-toolbar></md-toolbar>',
                '           <div class="md-padding" layout-padding>',
                '               <span class="md-title">{{ hike.location | location }}</span>',
                '               <rating ratings="hike.ratingCounts"></rating>',
                '           </div>',
                '       </div>',
                '       <md-list class="md-no-padding" ng-click="toggleNodeNav()">',
                '           <md-list-item aria-label="Hike Overview" ng-href="/hike/{{ hike.slug }}" ng-class="!currentNode ? \'active\' : \'\'">',
                '               Overview',
                '           </md-list-item>',
                '           <md-list-item aria-label="{{ node.title }}" ng-repeat="node in hike.nodes" ng-href="/hike/{{ hike.slug }}/{{ node.id }}"',
                '               ng-class="currentNode.id === node.id ? \'active\' : \'\'">',
                '               <span ng-bind="node.title"></span>',
                '           </md-list-item>',
                '       </md-list>',
                '   </md-content>',
                '</md-sidenav>'
            )
        };
    },
    
    resourceService = function($cacheFactory, $log, $q, $resource){
        
        var MINIMUM_SCHEMA_VERSION = '0.1',
            
            /**
             * Check if an aribitrary version is >= MINIMUM_SCHEMA_VERSION
             */
            checkVersion = function(version) {
                
                var splitVersion = function(version) {
                    return version.split('.').map(parseInt);
                },
                
                minVersion = splitVersion(MINIMUM_SCHEMA_VERSION);
                version = splitVersion(version);
                
                for (var i=0, j=minVersion.length; i<j; i++){
                    if (minVersion[i] > version[i]) {
                        return false;
                    }
                }
                
                return true;
                
            },
            
            resourceProxyFactory = function(cls) {
                return function(){
                    return new (Function.prototype.bind.apply(cls, arguments));
                };
            },
            
            cachedGetterFactory = function(options) {
                var cache = options.cache,
                    fetchAction = options.fetchAction || angular.noop,
                    idKey = options.idKey,
                    resource = options.resource;
                    
                return function (id) {
                    
                    var item = cache.get(id);
                    
                    if (!item) {
                        var query = {};
                        query[idKey] = id;
                        var promise = resource.get(query).$promise.then(function(item){
                            try {
                                if (!checkVersion(item.schemaVersion)) {
                                    $log.warn("Using old hike schema:", item);
                                }
                            }
                            catch(e) {
                                $log.warn("Couldn't verify schema version:", item);
                            }
                            cache.put(id, item);
                            fetchAction(item);
                            return item;
                        });
                        cache.put(id, promise);
                        return promise;
                    }
                    
                    return $q.resolve(item);
                    
                };
            },
            
            addIdGetter = function(cls){
                Object.defineProperty(cls.prototype, "id", {
                    get: function(){ return this._id }
                });
            },
            
            hikeResource = $resource('/h/:hike?', {hike: '@hike'}),
            mediaResource = $resource('/m/:media?', {media: '@media'}),
            nodeResource = $resource('/n/:node?', {node: '@node'}),
            
            Hike = this.Hike = resourceProxyFactory(hikeResource),
            Media = this.Media = resourceProxyFactory(mediaResource),
            Node = this.Node = resourceProxyFactory(nodeResource),
            
            hikeCache = $cacheFactory('hike-cache'),
            mediaCache = $cacheFactory('media-cache'),
            nodeCache = $cacheFactory('node-cache'),
            
            fetchMediaFor = function(node) {
                node.media = [];
                angular.forEach(node.mediaIds, function(mediaId, mediaIndex){
                    node.media.push(Media.get(mediaId).then(function(media){
                        node.media[mediaIndex] = media;
                        return media;
                    }));
                });
            },
            
            fetchNodesFor = function(hike) {
                hike.nodes = [];
                angular.forEach(hike.nodeIds, function(nodeId, nodeIndex){
                    hike.nodes.push(Node.get(nodeId).then(function(node){
                        hike.nodes[nodeIndex] = node;
                        return node;
                    }));
                });
            };
            
        hikeResource.prototype.getNode = function(index) {
            var node = this.nodes[index];
            if (node.then) {
                return node;
            }
            else {
                var deferred = $q.defer();
                deferred.resolve(node);
                return deferred.promise;
            }
        };
            
        Hike.get = cachedGetterFactory({
            cache: hikeCache,
            fetchAction: fetchNodesFor,
            idKey: 'hike',
            resource: hikeResource
        });
        
        Media.get = cachedGetterFactory({
            cache: mediaCache,
            idKey: 'media',
            resource: mediaResource
        });
        
        Node.get = cachedGetterFactory({
            cache: nodeCache,
            fetchAction: fetchMediaFor,
            idKey: 'node',
            resource: nodeResource
        });
        
        addIdGetter(hikeResource);
        addIdGetter(mediaResource);
        addIdGetter(nodeResource);
        
        return this;
    
    };
    
    module.directive('hikePage', hikePageDirective)
        .directive('hikeSidenav', hikeSidenavDirective)
        .directive('hikeToolbar', hikeToolbarDirective)
        .filter('location', hikeLocationFilter)
        .service('resource', resourceService);
    
    return module;
    
});