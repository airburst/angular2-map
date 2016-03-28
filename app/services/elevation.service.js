System.register(['angular2/core', 'rxjs/add/operator/map', 'angular2/http', '../utils/utils', '../route', '@ngrx/store', '../reducers/details'], function(exports_1, context_1) {
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
    var core_1, http_1, utils_1, route_1, store_1, details_1;
    var ElevationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {},
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
            function (details_1_1) {
                details_1 = details_1_1;
            }],
        execute: function() {
            ElevationService = (function () {
                function ElevationService(store, http) {
                    this.store = store;
                    this.http = http;
                    this.elevationUrl = 'http://localhost/getOSElevation.php';
                    this.results = [];
                    this.sampleSize = 200;
                    this.route = new route_1.Route(store);
                }
                ;
                ElevationService.prototype.init = function () {
                    var _this = this;
                    this.gridProjection = new window.OpenSpace.GridProjection();
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
                    if ((segment !== undefined) && (!segment.hasElevationData) && (segment.track.length > 0)) {
                        this.getElevationFromApi(segment);
                    }
                };
                ;
                ElevationService.prototype.getElevationFromApi = function (segment) {
                    var _this = this;
                    var path = this.flattenRoute(segment.track);
                    console.log(path); //
                    if (path.length <= 1) {
                        throw ('No elevation requested: too few points in path');
                    }
                    else {
                        var headers = new http_1.Headers();
                        headers.append('Content-Type', 'application/x-www-form-urlencoded');
                        return this.http.post(this.elevationUrl, 'points=' + JSON.stringify(path), { headers: headers })
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) { return _this.updateStore(data, segment); }, function (err) { return console.log(err); }, function () { return console.log('Elevation fetch Complete'); });
                    }
                };
                // Flatten into an array of [easting, northing]
                ElevationService.prototype.flattenRoute = function (points) {
                    var _this = this;
                    return points.map(function (point) {
                        var mp = _this.convertToOsMapPoint(point);
                        return ([mp.x, mp.y]);
                    });
                };
                ;
                ElevationService.prototype.convertToOsMapPoint = function (point) {
                    var mp = new window.OpenLayers.LonLat(point.lon, point.lat), mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
                    return new window.OpenLayers.Geometry.Point(mapPoint.lon, mapPoint.lat);
                };
                ;
                ElevationService.prototype.updateStore = function (data, segment) {
                    console.log(data); //
                    // this.store.dispatch({
                    //     type: ADD_ELEVATION,
                    //     payload: flatten(data)
                    // });
                    // this.store.dispatch({
                    //     type: UPDATE_SEGMENT,
                    //     payload: { id: segment.id, hasElevationData: true }
                    // });
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