System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var ElevationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ElevationService = (function () {
                function ElevationService() {
                    // Reduce a path to <= maximum sample size (256)
                    this.reducePath = function (points) {
                        var path = [];
                        // If elevation path is below max size, use it
                        var eLen = points.length;
                        if (eLen < this.sampleSize) {
                            return points;
                        }
                        // Otherwise, reduce to no more than the max number of point
                        var eDiv = Math.floor(eLen / this.sampleSize) + 1; // Reduction factor
                        var eMod = eLen - (Math.floor(eLen / eDiv) * eDiv); // Remainder of single points
                        var eLast = eLen - eMod; // Last factorised sample point
                        // Resample at interval of (eDiv) points
                        for (var i = 0; i < eLast; i += eDiv) {
                            path.push(points[i]);
                        }
                        // Then add the last individual points at frequency = 1
                        for (var i = eLast; i < eLen; i++) {
                            path.push(points[i]);
                        }
                        return path;
                    };
                    this.results = [];
                    this.elevator = {};
                    this.sampleSize = 256;
                }
                ElevationService.prototype.init = function () {
                    this.elevator = new window.google.maps.ElevationService();
                    this.status = window.google.maps.ElevationStatus;
                };
                // Return elevation data for route
                ElevationService.prototype.elevation = function (path, callback) {
                    console.log('path', path);
                    if (path.length <= 1) {
                        console.log('No elevation requested: too few points in path');
                        callback([], this.status.OK);
                    }
                    // Batch into samples and create an elevation request for each path
                    this.elevator.getElevationAlongPath({
                        'path': path,
                        'samples': this.sampleSize
                    }, callback);
                };
                ;
                // Convert Point into Google LatLng
                ElevationService.prototype.toLatLng = function (point) {
                    return new window.google.maps.LatLng(point.lat, point.lon);
                };
                // Convert Path into Google Path
                // TODO: Only return points that don't already have elevation data
                ElevationService.prototype.googleRoute = function (points) {
                    var _this = this;
                    var gPath = [];
                    points.forEach(function (point) { gPath.push(_this.toLatLng(point)); });
                    return gPath;
                };
                // Combine several requests into single response
                ElevationService.prototype.multiPathHandler = function (results, status, index) {
                    if (status !== this.status.OK) {
                        console.log(status);
                    }
                    else {
                        this.results[index] = results;
                        console.log(this.results);
                    }
                };
                // Cut a path into an array of paths, each <= sample size
                ElevationService.prototype.getElevation = function (route) {
                    var i, j, index = 0, pathArray, path = this.googleRoute(route.points), self = this;
                    for (i = 0, j = path.length; i < j; i += this.sampleSize) {
                        pathArray = path.slice(i, i + this.sampleSize);
                        this.elevation(pathArray, function (results, status) {
                            console.log(index);
                            self.multiPathHandler(results, status, index);
                        });
                        index++;
                    }
                };
                ElevationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ElevationService);
                return ElevationService;
            }());
            exports_1("ElevationService", ElevationService);
        }
    }
});
//# sourceMappingURL=elevation.service.js.map