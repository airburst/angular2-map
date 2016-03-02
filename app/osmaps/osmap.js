System.register(['angular2/core', '../route', '../config/config'], function(exports_1, context_1) {
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
    var core_1, route_1, config_1;
    var OsMap;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            }],
        execute: function() {
            OsMap = (function () {
                function OsMap() {
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
                    this.followsRoads = false;
                    this.route = new route_1.Route();
                }
                OsMap.prototype.init = function () {
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
                    this.addPointToMap(e, pt);
                };
                ;
                OsMap.prototype.clickPoint = function (e) {
                    var pt = this.osMap.getLonLatFromViewPortPx(e.xy);
                    this.addPointToMap(e, pt);
                };
                ;
                OsMap.prototype.addPointToMap = function (e, pt) {
                    var clickedPoint = new this.ol.Geometry.Point(pt.lon, pt.lat);
                    // if ((this.followsRoads) && (this.route.wayPoints.length > 1)) {
                    //     // Try to use Google Directions API to make the route follow roads
                    //     //this.snapToRoad();
                    // } else {
                    this.route.addPoint(clickedPoint);
                    this.route.addWayPoint(new route_1.WayPoint(clickedPoint, 1));
                    //}
                    this.ol.Event.stop(e);
                    this.draw();
                };
                ;
                // Convert OpenSpace Point into Google LatLng
                // $scope.pointToGoogle = function(point) {
                //     var ll = $scope.gridProjection.getLonLatFromMapPoint(point);
                //     return new google.maps.LatLng(ll.lat, ll.lon);
                // };
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
                OsMap.prototype.calculateDistanceInKm = function () {
                    var distString = new this.ol.Geometry.Curve(this.convertToOsPathFormat());
                    return (distString.getLength() / 1000);
                };
                OsMap.prototype.convertToOsPathFormat = function () {
                    var _this = this;
                    var path = [];
                    this.route.points.forEach(function (point) {
                        path.push(_this.convertToOsMapPoint(point));
                    });
                    return path;
                };
                OsMap.prototype.convertToOsMapPoint = function (point) {
                    console.log(point);
                    var mp = new this.ol.LonLat(point.lon, point.lat), mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
                    return new this.ol.Geometry.Point(mapPoint.lon, mapPoint.lat);
                };
                ;
                OsMap.prototype.draw = function () {
                    var _this = this;
                    console.log(this.route);
                    var routeStyle = config_1.settings.routeStyle, waypointsFeature = [], markersFeature = [];
                    var path = this.convertToOsPathFormat();
                    console.log(path);
                    // Set the lines array (line segments in route)
                    var routeFeature = new this.ol.Feature.Vector(new this.ol.Geometry.LineString(path), null, routeStyle);
                    // Add waypoints
                    this.route.wayPoints.forEach(function (w) {
                        waypointsFeature.push(new _this.ol.Feature.Vector(_this.convertToOsMapPoint(w.point)));
                    });
                    // Add route markers
                    this.route.markers.forEach(function (m) {
                        markersFeature.push(_this.addMarker(m, 'dist/assets/images/map-marker.png'));
                    });
                    // Replace the existing layer
                    this.pointVectorLayer.destroyFeatures();
                    this.pointVectorLayer.addFeatures(waypointsFeature);
                    this.lineVectorLayer.destroyFeatures();
                    this.lineVectorLayer.addFeatures([routeFeature]);
                    this.markerVectorLayer.destroyFeatures();
                    this.markerVectorLayer.addFeatures(markersFeature);
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
                    __metadata('design:paramtypes', [])
                ], OsMap);
                return OsMap;
            }());
            exports_1("OsMap", OsMap);
        }
    }
});
//# sourceMappingURL=osmap.js.map