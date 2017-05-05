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
        
        olMap.prototype.setLocation = function(location) {
            this.vectorSource.clear();
            this.centralCoordinate = ol.proj.fromLonLat([
                location.longitude,
                location.latitude
            ], 'EPSG:3857');
            this.vectorSource.addFeature(new ol.Feature({
                type: 'node',
                geometry: new ol.geom.Point(this.centralCoordinate)
            }));
            this.zoomToLocation();
        };
        
        olMap.prototype.zoomToLocation = function() {
            this.map.getView().setCenter(this.centralCoordinate);
            this.map.getView().setZoom(12);
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
                    scope.map.zoomToLocation();
                });
            }
        };
    };
    
    module.directive('openlayers', openlayersDirective)
          .factory('olMap', olMapFactory);
    
    return module;
    
});