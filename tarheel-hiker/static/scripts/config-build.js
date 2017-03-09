({
  
  baseUrl: './src',
  
  // CDN's preferred when appropriate version is available
  paths: {
    
    // aframe 0.5.0
    'aframe'       : "empty:",
    
    // angular 1.6.2
    'angular'      : "empty:",
    'ngAnimate'    : "empty:",
    'ngAria'       : "empty:",
    'ngResource'   : "empty:",
    
    // angular material 1.1.3
    'ngMaterial'   : "empty:",
    
    // angular material icons 0.7.1
    'ngMdIcons'    : "empty:",
    
    // angular ui router 0.4.2
    'ui.router'    : "empty:",
    
    // openlayers 4.0.1
    'ol'           : "empty:",
    
    // css element queries - resize sensor 0.4.0
    'ResizeSensor' : "empty:",
    
    // svg morpheus ^0.3.0
    'svgMorpheus'  : "empty:",
    
    // tar heel hiker app
    'hiker'        : 'hiker',
    'src'          : '.',
    
  },
  
  name: "main",
  out: "hiker.min.js",
  
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