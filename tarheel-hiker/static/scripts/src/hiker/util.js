define([], function(){
    
    var exports = {};
    
    exports.getMediaURL = function(filename) {
        return '/asset/media/' + filename;
    };
    
    exports.html = function(){
        var html = "";
        for (var i=0, j=arguments.length; i<j; i++) {
            html += arguments[i].trim();
        }
        return html;
    };
    
    return exports;
    
});