System.register(['angular2/core', '../route', '../utils/utils', '../google/directions.service', '../config/config', 'rxjs/add/operator/map', '@ngrx/store', '../reducers/track'], function(exports_1, context_1) {
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
    var core_1, route_1, utils_1, directions_service_1, config_1, store_1, track_1;
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
            function (_1) {},
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (track_1_1) {
                track_1 = track_1_1;
            }],
        execute: function() {
            OsMap = (function () {
                function OsMap(directionsService, store) {
                    this.directionsService = directionsService;
                    this.store = store;
                    this.easting = 386210;
                    this.northing = 168060;
                    this.zoom = 7;
                    this.os = {};
                    this.ol = {};
                    this.osMap = {};
                    this.lineVectorLayer = {};
                    this.pointVectorLayer = {};
                    this.markerVectorLayer = {};
                    this.gridProjection = {};
                    this.isMoving = false;
                    this.followsRoads = true;
                    this.route = new route_1.Route();
                    this.track = store.select('track');
                }
                OsMap.prototype.init = function () {
                    this.ol = window.OpenLayers;
                    this.os = window.OpenSpace;
                    this.track.subscribe(function (v) { return console.log(v); });
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
                    this.centreMap();
                    // Set the projection - needed for converting between northing-easting and latlng
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
                    // Add map event handlers for touch and click
                    this.osMap.events.remove('dblclick');
                    this.osMap.events.register('touchmove', this.osMap, function () { this.isMoving = true; });
                    this.osMap.events.register('touchend', this.osMap, this.touchPoint.bind(this));
                    this.osMap.events.register('click', this.osMap, this.clickPoint.bind(this));
                };
                ;
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
                    var p = this.convertToLatLng(pt);
                    this.route.addWayPoint({ point: { lat: p.lat, lon: p.lon }, trackPointsCount: 1 }); //REMOVE
                    //MF
                    this.store.dispatch({
                        type: track_1.ADD_SEGMENT,
                        payload: { id: utils_1.uuid(), point: { lat: p.lat, lon: p.lon, ele: 0 } }
                    });
                    if ((this.followsRoads) && (this.route.wayPoints.length > 1)) {
                        var fp = this.route.penultimateWayPoint().point, from = this.directionsService.convertToGoogleMapPoint(fp), tp = this.route.lastWayPoint().point, to = this.directionsService.convertToGoogleMapPoint(tp);
                        this.directionsService.getRouteBetween(from, to)
                            .then(function (response) {
                            _this.route.addPoints(response);
                            _this.route.lastWayPoint().trackPointsCount = response.length;
                            _this.draw();
                        }, function (response) {
                            console.error('Problem with directions service:', response);
                        });
                    }
                    else {
                        this.route.addPoint(p);
                        this.draw();
                    }
                    this.ol.Event.stop(e);
                };
                ;
                OsMap.prototype.convertToLatLng = function (point) {
                    var ll = this.gridProjection.getLonLatFromMapPoint(point);
                    return { lat: ll.lat, lon: ll.lon };
                };
                ;
                OsMap.prototype.drawWholeRoute = function () {
                    var centre = this.convertToOsMapPoint(this.route.centre());
                    this.centreMap(centre.x, centre.y, this.route.getZoomLevel());
                    this.draw();
                };
                ;
                OsMap.prototype.centreMap = function (easting, northing, zoom) {
                    if (easting !== undefined) {
                        this.easting = easting;
                    }
                    if (northing !== undefined) {
                        this.northing = northing;
                    }
                    if (zoom !== undefined) {
                        this.zoom = zoom;
                    }
                    this.osMap.setCenter(new this.os.MapPoint(this.easting, this.northing), this.zoom);
                };
                ;
                OsMap.prototype.draw = function () {
                    var _this = this;
                    var path = this.convertRouteToOsFormat();
                    // Plot route layer
                    var routeFeature = new this.ol.Feature.Vector(new this.ol.Geometry.LineString(path), null, config_1.settings.routeStyle);
                    // Plot waypoints layer
                    var waypointsFeature = [];
                    this.route.wayPoints.forEach(function (w) {
                        waypointsFeature.push(new _this.ol.Feature.Vector(_this.convertToOsMapPoint(w.point)));
                    });
                    // Plot route markers layer
                    var markersFeature = [];
                    this.route.markers.forEach(function (m) {
                        markersFeature.push(_this.addMarker(m, 'dist/assets/images/map-marker.png'));
                    });
                    // Replace existing layers
                    this.pointVectorLayer.destroyFeatures();
                    this.pointVectorLayer.addFeatures(waypointsFeature);
                    this.lineVectorLayer.destroyFeatures();
                    this.lineVectorLayer.addFeatures([routeFeature]);
                    this.markerVectorLayer.destroyFeatures();
                    this.markerVectorLayer.addFeatures(markersFeature);
                    // Update distance
                    this.route.distance = new this.ol.Geometry.Curve(path).getLength() / 1000;
                };
                ;
                OsMap.prototype.convertRouteToOsFormat = function () {
                    var _this = this;
                    var path = [];
                    this.route.points.forEach(function (point) {
                        path.push(_this.convertToOsMapPoint(point));
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
                OsMap.prototype.calculateDistanceInKm = function () {
                    var distString = new this.ol.Geometry.Curve(this.convertRouteToOsFormat());
                    return (distString.getLength() / 1000);
                };
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