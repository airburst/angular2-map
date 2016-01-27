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
                    this.osMap = {};
                    this.lineVectorLayer = {};
                    this.pointVectorLayer = {};
                    this.markerVectorLayer = {};
                    this.gazetteer = {};
                    this.gridProjection = {};
                }
                OsMap.prototype.init = function () {
                    // Instantiate the map canvas
                    var options = {
                        controls: [
                            new window.OpenLayers.Control.Navigation(),
                            new window.OpenLayers.Control.TouchNavigation({
                                dragPanOptions: { enableKinetic: true }
                            }),
                            new window.OpenLayers.Control.KeyboardDefaults(),
                            new window.OpenSpace.Control.CopyrightCollection(),
                            new window.OpenLayers.Control.ArgParser()
                        ]
                    };
                    this.osMap = new window.OpenSpace.Map('map', options);
                    this.centreMap();
                    // Set the projection - needed for converting between northing-easting and latlng
                    this.gridProjection = new window.OpenSpace.GridProjection();
                    // Initialise the vector layers
                    this.lineVectorLayer = new window.OpenLayers.Layer.Vector('Line Vector Layer');
                    this.osMap.addLayer(this.lineVectorLayer);
                    this.pointVectorLayer = new window.OpenLayers.Layer.Vector('Point Vector Layer');
                    this.osMap.addLayer(this.pointVectorLayer);
                    this.markerVectorLayer = new window.OpenLayers.Layer.Vector('Point Vector Layer');
                    this.osMap.addLayer(this.markerVectorLayer);
                    // Add controls
                    var position = new window.OpenSpace.Control.ControlPosition(window.OpenSpace.Control.ControlAnchor.ANCHOR_TOP_LEFT, new window.OpenLayers.Size(0, 100));
                    this.osMap.addControl(new window.OpenSpace.Control.LargeMapControl(), position);
                    // // Add map event handlers for touch and click
                    // $scope.osMap.events.remove('dblclick');
                    // $scope.osMap.events.register('touchmove', $scope.osMap, function() { $scope.dragging = true; });
                    // $scope.osMap.events.register('touchend', $scope.osMap, $scope.touchPoint);
                    // $scope.osMap.events.register('click', $scope.osMap, $scope.clickPoint);
                    // //Initialise gazetteer
                    this.gazetteer = new window.OpenSpace.Gazetteer();
                    // // Initialise GoogleMaps Elevator and Directions Services
                    // $scope.elevator = new google.maps.ElevationService();
                    // $scope.directionsService = new google.maps.DirectionsService()
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
                    this.osMap.setCenter(new window.OpenSpace.MapPoint(this.easting, this.northing), this.zoom);
                };
                ;
                // Convert OpenSpace Point into Google LatLng
                // $scope.pointToGoogle = function(point) {
                //     var ll = $scope.gridProjection.getLonLatFromMapPoint(point);
                //     return new google.maps.LatLng(ll.lat, ll.lon);
                // };
                // Convert Point into OpenSpace MapPoint
                OsMap.prototype.convertToMapPoint = function (point) {
                    var mp = new window.OpenLayers.LonLat(point.lon, point.lat), mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
                    return new window.OpenLayers.Geometry.Point(mapPoint.lon, mapPoint.lat);
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
                    var distString = new window.OpenLayers.Geometry.Curve(this.toPath(route));
                    return (distString.getLength() / 1000);
                };
                // Draw path as a vector layer
                OsMap.prototype.drawPath = function (route) {
                    var routeStyle = config_1.settings.routeStyle, index, routeFeature, waypointsFeature = [];
                    // Convert route into OS path format
                    var path = this.toPath(route.points);
                    // Update the distance calculation.
                    //this.updateDistance();
                    // Set the lines array (line segments in route)
                    routeFeature = new window.OpenLayers.Feature.Vector(
                    // new window.OpenLayers.Geometry.LineString(points),
                    new window.OpenLayers.Geometry.LineString(path), null, routeStyle);
                    // Add waypoint markers
                    route.waypoints.forEach(function (w) {
                        waypointsFeature.push(new window.OpenLayers.Feature.Vector(w.point));
                    });
                    // Replace the existing layer
                    this.pointVectorLayer.destroyFeatures();
                    this.pointVectorLayer.addFeatures(waypointsFeature);
                    this.lineVectorLayer.destroyFeatures();
                    this.lineVectorLayer.addFeatures([routeFeature]);
                };
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