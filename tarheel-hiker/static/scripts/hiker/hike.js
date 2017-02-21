define(['angular', 'ol', 'ngResource', 'hiker/map', 'hiker/media'], function(angular, ol){
    
    var module = angular.module('hiker.hike', ['ngResource', 'hiker.map', 'hiker.media']);
    
    var hikeController = function($scope, $mdSidenav, $q, $state, olMap, resource){
        
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
        
    };
    
    var resourceService = function($cacheFactory, $log, $q, $resource){
        
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
                        return resource.get(query).$promise.then(function(item){
                            if (!checkVersion(item.schemaVersion)) {
                                $log.warn("Using old hike schema.")
                            }
                            cache.put(id, item);
                            fetchAction(item);
                            return item;
                        });
                    }
                    
                    var deferred = $q.defer();
                    
                    deferred.resolve(item);
                    
                    return deferred.promise;
                    
                };
            },
            
            addIdGetter = function(cls){
                Object.defineProperty(cls.prototype, "id", {
                    get: function(){ return this._id }
                });
            },
            
            hikeResource = $resource('/h/:hike?', {hike: '@hike'}),
            nodeResource = $resource('/n/:node?', {node: '@node'}),
            
            Hike = this.Hike = resourceProxyFactory(hikeResource),
            Node = this.Node = resourceProxyFactory(nodeResource),
            
            hikeCache = $cacheFactory('hike-cache'),
            nodeCache = $cacheFactory('node-cache'),
            
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
        
        Node.get = cachedGetterFactory({
            cache: nodeCache,
            idKey: 'node',
            resource: nodeResource
        });
        
        addIdGetter(hikeResource);
        addIdGetter(nodeResource);
        
        return this;
    
    };
    
    
    module.controller('hikeController', hikeController)
          .service('resource', resourceService);
    
    return module;
    
});