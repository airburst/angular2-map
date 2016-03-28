System.register(['angular2/core', '../route', '../utils/utils', '../google/directions.service', '../config/config', '@ngrx/store', '../reducers/track', '../reducers/details'], function(exports_1, context_1) {
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
    var core_1, route_1, utils_1, directions_service_1, config_1, store_1, track_1, details_1;
    var OsMap;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (directions_service_1_1) {
                directions_service_1 = directions_service_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (track_1_1) {
                track_1 = track_1_1;
            },
            function (details_1_1) {
                details_1 = details_1_1;
            }],
        execute: function() {
            OsMap = (function () {
                function OsMap(directionsService, store) {
                    this.directionsService = directionsService;
                    this.store = store;
                    this.os = {};
                    this.ol = {};
                    this.osMap = {};
                    this.lineVectorLayer = {};
                    this.pointVectorLayer = {};
                    this.markerVectorLayer = {};
                    this.gridProjection = {};
                    this.isMoving = false;
                    this.followsRoads = true;
                    this.route = new route_1.Route(store);
                }
                OsMap.prototype.init = function () {
                    var _this = this;
                    this.ol = window.OpenLayers;
                    this.os = window.OpenSpace;
                    // Instantiate the map canvas
                    var options = {
                        controls: [
                            new this.ol.Control.Navigation(),
                            new this.ol.Control.TouchNavigation({
                                dragPanOptions: { enableKinetic: true }
                            }),
                            new this.ol.Control.KeyboardDefaults(),
                            new this.os.Control.CopyrightCollection(),
                            new this.ol.Control.ArgParser()
                        ]
                    };
                    this.osMap = new this.os.Map('map', options);
                    this.centreMap(this.store.getState().details);
                    this.gridProjection = new this.os.GridProjection();
                    // Initialise the vector layers
                    this.lineVectorLayer = new this.ol.Layer.Vector('Line Vector Layer');
                    this.osMap.addLayer(this.lineVectorLayer);
                    this.pointVectorLayer = new this.ol.Layer.Vector('Point Vector Layer');
                    this.osMap.addLayer(this.pointVectorLayer);
                    this.markerVectorLayer = new this.ol.Layer.Vector('Point Vector Layer');
                    this.osMap.addLayer(this.markerVectorLayer);
                    // Add controls
                    var position = new this.os.Control.ControlPosition(this.os.Control.ControlAnchor.ANCHOR_TOP_LEFT, new this.ol.Size(0, 100));
                    this.osMap.addControl(new this.os.Control.LargeMapControl(), position);
                    this.osMap.events.remove('dblclick');
                    this.route.track$.subscribe(function (v) {
                        _this.draw(v);
                    });
                    this.route.details$.subscribe(function (v) {
                        if (v.isImported) {
                            _this.unRegisterEvents();
                            _this.centreMap(v);
                        }
                        else {
                            _this.unRegisterEvents();
                            _this.registerEvents();
                        }
                    });
                };
                ;
                OsMap.prototype.registerEvents = function () {
                    this.osMap.events.register('touchmove', this.osMap, function () { this.isMoving = true; });
                    this.osMap.events.register('touchend', this.osMap, this.touchPoint.bind(this));
                    this.osMap.events.register('click', this.osMap, this.clickPoint.bind(this));
                };
                OsMap.prototype.unRegisterEvents = function () {
                    this.osMap.events.remove('touchmove');
                    this.osMap.events.remove('touchend');
                    this.osMap.events.remove('click');
                };
                OsMap.prototype.touchPoint = function (e) {
                    if (this.isMoving) {
                        this.isMoving = false;
                        return;
                    }
                    var p = {
                        x: e.changedTouches[0].clientX,
                        y: e.changedTouches[0].clientY
                    }, pt = this.osMap.getLonLatFromViewPortPx(p);
                    this.addWayPointToMap(e, pt);
                };
                ;
                OsMap.prototype.clickPoint = function (e) {
                    var pt = this.osMap.getLonLatFromViewPortPx(e.xy);
                    this.addWayPointToMap(e, pt);
                };
                ;
                OsMap.prototype.addWayPointToMap = function (e, pt) {
                    var _this = this;
                    var p = this.convertToLatLng(pt), uid = utils_1.uuid();
                    this.store.dispatch({
                        type: track_1.ADD_SEGMENT,
                        payload: { id: uid, waypoint: { lat: p.lat, lon: p.lon, ele: 0 }, track: [], hasElevationData: false }
                    });
                    // Get value from Observable
                    var track = this.store.getState().track;
                    if ((this.followsRoads) && (track.length > 1)) {
                        var fp = track[track.length - 2].waypoint, from = this.directionsService.convertToGoogleMapPoint(fp), tp = track[track.length - 1].waypoint, to = this.directionsService.convertToGoogleMapPoint(tp);
                        this.directionsService.getRouteBetween(from, to)
                            .then(function (response) {
                            _this.store.dispatch({
                                type: track_1.UPDATE_SEGMENT,
                                payload: { id: uid, track: response }
                            });
                        }, function (response) {
                            console.error('Problem with directions service:', response);
                        });
                    }
                    this.ol.Event.stop(e);
                };
                ;
                OsMap.prototype.convertToLatLng = function (point) {
                    var ll = this.gridProjection.getLonLatFromMapPoint(point);
                    return { lat: ll.lat, lon: ll.lon };
                };
                ;
                OsMap.prototype.centreMap = function (options) {
                    console.log('centre map: ', options); //
                    if (options !== undefined) {
                        var mp = void 0;
                        if (options.lat !== 0) {
                            mp = this.convertToOsMapPoint({ lat: options.lat, lon: options.lon });
                        }
                        else {
                            mp = new this.os.MapPoint(options.easting, options.northing);
                        }
                        this.osMap.setCenter(mp, options.zoom);
                    }
                };
                ;
                OsMap.prototype.draw = function (track) {
                    var _this = this;
                    var path = this.convertRouteToOsFormat(track);
                    // Plot route layer
                    var routeFeature = new this.ol.Feature.Vector(new this.ol.Geometry.LineString(path), null, config_1.settings.routeStyle);
                    // Plot waypoints layer
                    var waypointsFeature = [];
                    track.forEach(function (s) {
                        if (s.waypoint !== null) {
                            waypointsFeature.push(new _this.ol.Feature.Vector(_this.convertToOsMapPoint(s.waypoint)));
                        }
                    });
                    // Plot route markers layer
                    // let markersFeature: Marker[] = [];
                    // this.route.markers.forEach((m: Marker) => {
                    //     markersFeature.push(this.addMarker(m, 'dist/assets/images/map-marker.png'));
                    // });
                    // Replace existing layers
                    this.pointVectorLayer.destroyFeatures();
                    this.pointVectorLayer.addFeatures(waypointsFeature);
                    this.lineVectorLayer.destroyFeatures();
                    this.lineVectorLayer.addFeatures([routeFeature]);
                    // this.markerVectorLayer.destroyFeatures();
                    // this.markerVectorLayer.addFeatures(markersFeature);
                    // Update distance
                    this.store.dispatch({
                        type: details_1.UPDATE_DETAILS,
                        payload: { distance: new this.ol.Geometry.Curve(path).getLength() / 1000 }
                    });
                };
                ;
                OsMap.prototype.convertRouteToOsFormat = function (track) {
                    var _this = this;
                    var path = [];
                    track.forEach(function (segment) {
                        segment.track.forEach(function (point) {
                            path.push(_this.convertToOsMapPoint(point));
                        });
                    });
                    return path;
                };
                OsMap.prototype.convertToOsMapPoint = function (point) {
                    var mp = new this.ol.LonLat(point.lon, point.lat), mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
                    return new this.ol.Geometry.Point(mapPoint.lon, mapPoint.lat);
                };
                ;
                OsMap.prototype.addMarker = function (marker, image) {
                    return new this.ol.Feature.Vector(this.convertToOsMapPoint(marker.point), /* Geometry */ { description: marker.name }, /* Attributes */ {
                        label: marker.name,
                        labelAlign: 'l',
                        labelXOffset: 16,
                        labelYOffset: 32,
                        fontFamily: 'Arial',
                        fontColor: 'black',
                        fontSize: '0.7em',
                        externalGraphic: image,
                        graphicHeight: 32,
                        graphicWidth: 32,
                        graphicXOffset: -16,
                        graphicYOffset: -32
                    });
                };
                ;
                OsMap = __decorate([
                    core_1.Component({
                        selector: 'map',
                        template: '<div id="map"></div>'
                    }), 
                    __metadata('design:paramtypes', [directions_service_1.DirectionsService, store_1.Store])
                ], OsMap);
                return OsMap;
            }());
            exports_1("OsMap", OsMap);
        }
    }
});
//# sourceMappingURL=osmap.js.map