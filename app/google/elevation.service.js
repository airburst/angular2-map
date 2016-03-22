System.register(['angular2/core', '../utils/utils', '@ngrx/store'], function(exports_1, context_1) {
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
    var core_1, utils_1, store_1;
    var ElevationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            }],
        execute: function() {
            ElevationService = (function () {
                function ElevationService(store) {
                    this.store = store;
                    // Reduce a path to <= maximum sample size
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
                    this.sampleSize = 240;
                    this.track = store.select('track');
                }
                ;
                ElevationService.prototype.init = function () {
                    var _this = this;
                    this.elevator = new window.google.maps.ElevationService();
                    this.status = window.google.maps.ElevationStatus;
                    // Subscribe to changes in the track and get elevation for 
                    // the latest segment, if it hasn't already been processed
                    this.track.subscribe(function (v) {
                        _this.getElevation(v[v.length - 1]);
                    });
                };
                ;
                ElevationService.prototype.getElevation = function (segment) {
                    var i, pathArray, path = [], elevationPromises;
                    if ((segment !== undefined) && (segment.track.length > 0)) {
                        path = this.convertToGoogleRoute(segment.track);
                        pathArray = utils_1.chunk(path, this.sampleSize);
                        elevationPromises = pathArray.map(this.elevation.bind(this));
                        Promise.all(elevationPromises)
                            .then(function (response) {
                            console.log([].concat.apply([], response));
                        }, function (error) {
                            console.log(error);
                        });
                    }
                };
                ;
                ElevationService.prototype.convertToGoogleRoute = function (points) {
                    return points.map(function (point) {
                        return new window.google.maps.LatLng(point.lat, point.lon);
                    });
                };
                ;
                ElevationService.prototype.elevation = function (path) {
                    var self = this;
                    return new Promise(function (resolve, reject) {
                        console.log('path', path.length); //
                        if (path.length <= 1) {
                            reject('No elevation requested: too few points in path');
                        }
                        self.elevator.getElevationAlongPath({
                            'path': path,
                            'samples': (path.length < self.sampleSize) ? path.length : self.sampleSize
                        }, function (results, status) {
                            if (status === self.status.OK) {
                                if (results[0]) {
                                    resolve(results);
                                }
                                else
                                    reject('No valid result was determined from the Google Elevation service. Please try again');
                            }
                            else
                                reject('Google Elevation service was not available. Please try again');
                        });
                    });
                };
                ;
                ElevationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [store_1.Store])
                ], ElevationService);
                return ElevationService;
            }());
            exports_1("ElevationService", ElevationService);
        }
    }
});
//# sourceMappingURL=elevation.service.js.map