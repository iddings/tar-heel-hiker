define(['angular'], function(angular){
    
    var exports = {};
    
    exports.Component = function(options){
        return function(){
            return angular.extend({
                restrict: 'E'
            }, options);
        }
    };
    
    exports.getMediaURL = function(filename) {
        return '//static.tarheelhiker.com/media/' + filename;
    };
    
    exports.html = function(){
        var html = "";
        for (var i=0, j=arguments.length; i<j; i++) {
            html += arguments[i].replace(/(^\s+)|(\s+$)/g, " ");
        }
        return html;
    };
    
    return exports;
    
});