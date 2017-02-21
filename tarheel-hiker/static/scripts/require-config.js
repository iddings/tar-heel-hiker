define({
  baseUrl: '/',
  // Here paths are set relative to `/source` folder
  paths: {
    'aframe'       : 'node_modules/aframe/dist/aframe-master',
    'angular'      : 'node_modules/angular/angular',
    'hiker'        : 'asset/scripts/hiker',
    'ngAnimate'    : 'node_modules/angular-animate/angular-animate',
    'ngAria'       : 'node_modules/angular-aria/angular-aria',
    'ngMaterial'   : 'node_modules/angular-material/angular-material',
    'ngMdIcons'    : 'node_modules/angular-material-icons/angular-material-icons',
    'ngResource'   : 'node_modules/angular-resource/angular-resource',
    'ui.router'    : 'node_modules/angular-ui-router/release/angular-ui-router',
    'ol'           : 'node_modules/openlayers/dist/ol',
    'ResizeSensor' : 'node_modules/css-element-queries/src/ResizeSensor',
    'src'          : 'asset/scripts',
    'svgMorpheus'  : 'node_modules/svg-morpheus/compile/minified/svg-morpheus'
  },
  shim: {
    'angular'      : {exports: 'angular'},
    'ngAnimate'    : ['angular'],
    'ngAria'       : ['angular'],
    'ngMaterial'   : ['angular', 'ngAnimate', 'ngAria'],
    'ngMdIcons'    : ['angular', 'svgMorpheus'],
    'ngResource'   : ['angular'],
    'ngRoute'      : ['angular'],
    'ui.router'    : ['angular']
    //'openlayers'   : {exports: 'ol'}
  }
});