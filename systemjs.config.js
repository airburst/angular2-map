(function (global) {
  // map tells the System loader where to look for things
  var map = {
    'app': 'app', // 'dist',
    'rxjs': 'node_modules/rxjs',
    'rxjs/subject': 'node_modules/rxjs',
    // 'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    '@angular': 'node_modules/@angular',
    '@ngrx/store': 'node_modules/@ngrx/store',
    'd3': 'node_modules/d3'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app': {main: 'boot.js', defaultExtension: 'js'},
    'rxjs': {defaultExtension: 'js'},
    '@ngrx/store': {main: 'index.js', format: 'cjs'},
    'd3': {main: 'd3.js'} 
  };
  
  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing'
  ];
  
  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function (pkgName) {
    packages[pkgName] = {main: 'index.js', defaultExtension: 'js'};
  });
  
  var config = {
    map: map,
    packages: packages
  };
  
  System.config(config);
})(this);
