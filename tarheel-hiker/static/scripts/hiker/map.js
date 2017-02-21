define(['angular', 'ol', 'ResizeSensor'], function(angular, ol, ResizeSensor){
    
    var module = angular.module('hiker.map', []);
    
    var olMapFactory = function(){
        
        var olMap = function() {
            
            var vectorSource = this.vectorSource = new ol.source.Vector(),
            
            vectorLayer = this.vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: function(feature) {
                    return olMap.styles[feature.get('type')];
                }
            });
            
            this.map = new ol.Map({
                controls: [],
                interactions: [],
                view: new ol.View({
                    center: [0, 0],
                    zoom: 1
                }),
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    vectorLayer
                ],
            });
            
        };
        
        olMap.styles = {
            
            'activeNode': new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    snapToPixel: false,
                    fill: new ol.style.Fill({color: 'blue'}),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2
                    })
                })
            }),
            
            'node': new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    snapToPixel: false,
                    fill: new ol.style.Fill({color: 'black'}),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2
                    })
                })
            })
            
        };
        
        olMap.prototype.addNode = function(node) {
            this.vectorSource.addFeature(new ol.Feature({
                type: 'node',
                node: node,
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([
                        node.location.longitude,
                        node.location.latitude
                    ], 'EPSG:3857')
                )
            }));
        };
        
        olMap.prototype.addNodes = function(nodes) {
            var self = this;
            angular.forEach(nodes, function(node){
                self.addNode(node);
            });
        };
        
        olMap.prototype.setNodes = function(nodes) {
            this.vectorSource.clear();
            this.addNodes(nodes);
        };
        
        olMap.prototype.setActiveNode = function(node) {
            var self = this;
            angular.forEach(this.vectorSource.getFeatures(), function(feature){
                var nodeType = (node && node.id === feature.get('node').id) ? "activeNode" : "node";
                feature.setStyle(olMap.styles[nodeType]);
            });
        };
        
        olMap.prototype.zoomToNodes = function(){
            this.map.getView().fit(this.vectorSource.getExtent());
        };
        
        return olMap;
        
    };
    
    /**
     * Basic directive to connect an ol.Map object to
     * a canvas.
     */
    var openlayersDirective = function($log, olMap){
        return {
            scope: {
                map: "="
            },
            template: '<div></div>',
            replace: true,
            restrict: 'E',
            link: function(scope, element, attrs) {
                var isMap = scope.map instanceof olMap;
                if (!isMap) {
                    $log.error("invalid map object");
                    return;
                }
                scope.map.map.setTarget(element[0]);
                new ResizeSensor(element[0], function(){
                    scope.map.map.updateSize();
                });
            }
        };
    };
    
    module.directive('openlayers', openlayersDirective)
          .factory('olMap', olMapFactory);
    
    return module;
    
});