System.register(['angular2/core', 'rxjs/add/operator/map', 'rxjs/operator/do', 'rxjs/operator/catch', 'angular2/http', '../utils/utils', '../route', '@ngrx/store', '../reducers/elevation', '../reducers/track', '../reducers/details'], function(exports_1, context_1) {
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
    var core_1, http_1, utils_1, route_1, store_1, elevation_1, track_1, details_1;
    var ElevationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (http_1_1) {
                http_1 = http_1_1;
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
                function ElevationService(store, http) {
                    this.store = store;
                    this.http = http;
                    this.SRTPUrl = 'http://localhost/getSRTMElevations.php';
                    this.results = [];
                    this.sampleSize = 200;
                    this.route = new route_1.Route(store);
                }
                ;
                ElevationService.prototype.init = function () {
                    var _this = this;
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
                    var i, pathArray, path = [], 
                    //elevationPromises,
                    segmentElevation = [];
                    if ((segment !== undefined) && (!segment.hasElevationData) && (segment.track.length > 0)) {
                        path = this.flattenRoute(segment.track);
                        this.getSRTPElevations(path, segment);
                    }
                };
                ;
                ElevationService.prototype.flattenRoute = function (points) {
                    return points.map(function (point) {
                        return ([point.lat, point.lon]);
                    });
                };
                ;
                ElevationService.prototype.getSRTPElevations = function (points, segment) {
                    var _this = this;
                    if (points.length <= 1) {
                        throw ('No elevation requested: too few points in path');
                    }
                    else {
                        var headers = new http_1.Headers();
                        headers.append('Content-Type', 'application/x-www-form-urlencoded');
                        return this.http.post(this.SRTPUrl, 'points=' + JSON.stringify(points), { headers: headers })
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) { return _this.updateStore(data, segment); }, function (err) { return console.log(err); }, function () { return console.log('Elevation fetch Complete'); });
                    }
                };
                ElevationService.prototype.updateStore = function (data, segment) {
                    console.log(data);
                    this.store.dispatch({
                        type: elevation_1.ADD_ELEVATION,
                        payload: utils_1.flatten(data)
                    });
                    this.store.dispatch({
                        type: track_1.UPDATE_SEGMENT,
                        payload: { id: segment.id, hasElevationData: true }
                    });
                };
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
                    __metadata('design:paramtypes', [store_1.Store, http_1.Http])
                ], ElevationService);
                return ElevationService;
            }());
            exports_1("ElevationService", ElevationService);
        }
    }
});
//# sourceMappingURL=elevation.service.js.map