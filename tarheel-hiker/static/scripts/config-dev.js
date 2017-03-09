define({
  
  baseUrl: '/',
  
  // CDN's preferred when appropriate version is available
  paths: {
    
    // aframe 0.5.0
    'aframe'       : ['//aframe.io/releases/0.5.0/aframe.min', 'node_modules/aframe/dist/aframe-master'],
    
    // angular 1.6.2
    'angular'      : ['//ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular.min', 'node_modules/angular/angular.min'],
    'ngAnimate'    : ['//ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular-animate.min', 'node_modules/angular-animate/angular-animate.min'],
    'ngAria'       : ['//ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular-aria.min', 'node_modules/angular-aria/angular-aria.min'],
    'ngResource'   : ['//ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular-resource.min', 'node_modules/angular-resource/angular-resource.min'],
    
    // angular material 1.1.3
    'ngMaterial'   : ['//cdn.rawgit.com/angular/bower-material/v1.1.3/angular-material.min', 'node_modules/angular-material/angular-material.min'],
    
    // angular material icons 0.7.1
    'ngMdIcons'    : ['//cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.7.1/angular-material-icons.min', 'node_modules/angular-material-icons/angular-material-icons.min'],
    
    // angular ui router 0.4.2
    'ui.router'    : ['//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.4.2/angular-ui-router.min', 'node_modules/angular-ui-router/release/angular-ui-router.min'],
    
    // openlayers 4.0.1
    'ol'           : ['//cdnjs.cloudflare.com/ajax/libs/ol3/4.0.1/ol', 'node_modules/openlayers/dist/ol'],
    
    // css element queries - resize sensor 0.4.0
    'ResizeSensor' : ['//cdnjs.cloudflare.com/ajax/libs/css-element-queries/0.4.0/ResizeSensor.min', 'node_modules/css-element-queries/src/ResizeSensor'],
    
    // svg morpheus ^0.3.0
    'svgMorpheus'  : ['//cdnjs.cloudflare.com/ajax/libs/SVG-Morpheus/0.3.2/svg-morpheus', 'node_modules/svg-morpheus/compile/minified/svg-morpheus'],
    
    // tar heel hiker app
    'hiker'        : 'asset/scripts/src/hiker',
    'src'          : 'asset/scripts/src',
    
  },
  
  shim: {
    
    'angular'      : {exports: 'angular'},
    'ngAnimate'    : ['angular'],
    'ngAria'       : ['angular'],
    'ngMaterial'   : ['angular', 'ngAnimate', 'ngAria'],
    'ngMdIcons'    : ['angular', 'svgMorpheus'],
    'ngResource'   : ['angular'],
    'ui.router'    : ['angular']
  }
  
});