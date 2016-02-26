System.register(['angular2/core', 'angular2/common', '../config/config'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, config_1;
    var OsMap;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
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
                    // // Add map event handlers for touch and click
                    // $scope.osMap.events.remove('dblclick');
                    // $scope.osMap.events.register('touchmove', $scope.osMap, function() { $scope.dragging = true; });
                    // $scope.osMap.events.register('touchend', $scope.osMap, $scope.touchPoint);
                    // $scope.osMap.events.register('click', $scope.osMap, $scope.clickPoint);
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
                // Convert OpenSpace Point into Google LatLng
                // $scope.pointToGoogle = function(point) {
                //     var ll = $scope.gridProjection.getLonLatFromMapPoint(point);
                //     return new google.maps.LatLng(ll.lat, ll.lon);
                // };
                // Convert Point into OpenSpace MapPoint
                OsMap.prototype.convertToMapPoint = function (point) {
                    var mp = new this.ol.LonLat(point.lon, point.lat), mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
                    return new this.ol.Geometry.Point(mapPoint.lon, mapPoint.lat);
                };
                ;
                // Convert Route into OpenSpace Path
                OsMap.prototype.toPath = function (route) {
                    var _this = this;
                    var path = [];
                    route.forEach(function (point) { path.push(_this.convertToMapPoint(point)); });
                    return path;
                };
                // Calculate total distance in km
                OsMap.prototype.getDistance = function (route) {
                    // Convert route into MapPoints
                    var distString = new this.ol.Geometry.Curve(this.toPath(route));
                    return (distString.getLength() / 1000);
                };
                // Draw path as a vector layer
                OsMap.prototype.drawPath = function (route) {
                    var _this = this;
                    var routeStyle = config_1.settings.routeStyle, waypointsFeature = [], markersFeature = [];
                    // Convert route into OS path format
                    var path = this.toPath(route.points);
                    // Set the lines array (line segments in route)
                    var routeFeature = new this.ol.Feature.Vector(new this.ol.Geometry.LineString(path), null, routeStyle);
                    // Add waypoints (editable)
                    route.waypoints.forEach(function (w) {
                        waypointsFeature.push(new _this.ol.Feature.Vector(_this.convertToMapPoint(w.point)));
                    });
                    // Add route markers
                    route.markers.forEach(function (m) {
                        markersFeature.push(_this.addMarker(m, 'dist/assets/images/map-marker.png'));
                    });
                    // Replace the existing layer
                    this.pointVectorLayer.destroyFeatures();
                    this.pointVectorLayer.addFeatures(waypointsFeature);
                    this.lineVectorLayer.destroyFeatures();
                    this.lineVectorLayer.addFeatures([routeFeature]);
                    this.markerVectorLayer.destroyFeatures();
                    this.markerVectorLayer.addFeatures(markersFeature);
                    // Add background style behind marker text
                    // let labels = document.getElementsByTagName('text');
                    // for (let i = 0; i < labels.length; i++) {
                    //     let svgRect: SVGRect = labels[i].getBBox();
                    //     let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    //     rect.setAttribute('x', svgRect.x.toString());
                    //     rect.setAttribute('y', svgRect.y.toString());
                    //     rect.setAttribute('width', svgRect.width.toString());
                    //     rect.setAttribute('height', svgRect.height.toString());
                    //     rect.setAttribute('fill', 'yellow');
                    //     document.insertBefore(rect, labels[i]);
                    // }
                };
                OsMap.prototype.addMarker = function (marker, image) {
                    return new this.ol.Feature.Vector(this.convertToMapPoint(marker.point), /* Geometry */ { description: marker.name }, /* Attributes */ {
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
                        template: '<div id="map"></div>',
                        directives: [common_1.FORM_DIRECTIVES],
                        styles: ["\n        #map: {\n            width: 100%;\n            height: 400px;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [])
                ], OsMap);
                return OsMap;
            })();
            exports_1("OsMap", OsMap);
        }
    }
});
//# sourceMappingURL=osmap.js.map