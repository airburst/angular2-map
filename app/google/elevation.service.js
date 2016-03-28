System.register(['angular2/core', '../utils/utils', '../route', '@ngrx/store', '../reducers/elevation', '../reducers/track', '../reducers/details'], function(exports_1, context_1) {
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
    var core_1, utils_1, route_1, store_1, elevation_1, track_1, details_1;
    var ElevationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (elevation_1_1) {
                elevation_1 = elevation_1_1;
            },
            function (track_1_1) {
                track_1 = track_1_1;
            },
            function (details_1_1) {
                details_1 = details_1_1;
            }],
        execute: function() {
            ElevationService = (function () {
                function ElevationService(store) {
                    this.store = store;
                    this.results = [];
                    this.elevator = {};
                    this.sampleSize = 200;
                    this.route = new route_1.Route(store);
                }
                ;
                ElevationService.prototype.init = function () {
                    var _this = this;
                    this.elevator = new window.google.maps.ElevationService();
                    this.status = window.google.maps.ElevationStatus;
                    // Subscribe to changes in the track and get elevation for 
                    // the latest segment, if it hasn't already been processed
                    this.route.track$.subscribe(function (v) {
                        _this.getElevationData(v[v.length - 1]);
                    });
                    this.route.elevation$.subscribe(function (v) {
                        _this.store.dispatch({
                            type: details_1.UPDATE_DETAILS,
                            payload: _this.calculateElevation(utils_1.flatten(v))
                        });
                    });
                };
                ;
                ElevationService.prototype.getElevationData = function (segment) {
                    var i, pathArray, path = [], elevationPromises, segmentElevation = [];
                    if ((segment !== undefined) && (!segment.hasElevationData) && (segment.track.length > 0)) {
                        path = this.convertToGoogleRoute(segment.track);
                        pathArray = utils_1.chunk(path, this.sampleSize);
                        elevationPromises = pathArray.map(this.elevation.bind(this));
                        Promise.all(elevationPromises)
                            .then(function (response) {
                            this.store.dispatch({
                                type: elevation_1.ADD_ELEVATION,
                                payload: utils_1.elevationData(utils_1.flatten(response))
                            });
                            this.store.dispatch({
                                type: track_1.UPDATE_SEGMENT,
                                payload: { id: segment.id, hasElevationData: true }
                            });
                        }.bind(this), function (error) {
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
                                reject('Google Elevation service was not available. Please try again. ' + status);
                        });
                    });
                };
                ;
                ElevationService.prototype.calculateElevation = function (elevations) {
                    var ascent = 0, lastElevation = elevations[0];
                    elevations.forEach(function (e) {
                        ascent += (e > lastElevation) ? (e - lastElevation) : 0;
                        lastElevation = e;
                    });
                    return { ascent: Math.floor(ascent) };
                };
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