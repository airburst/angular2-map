System.register(['../reducers/track', '../reducers/markers', '../reducers/elevation', '../reducers/details'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _this = this;
    var track_1, markers_1, elevation_1, details_1;
    var Route, RouteObserver, boundingRectangle, distance, initialBounds, centre, distanceBetween, getZoomLevel;
    return {
        setters:[
            function (track_1_1) {
                track_1 = track_1_1;
            },
            function (markers_1_1) {
                markers_1 = markers_1_1;
            },
            function (elevation_1_1) {
                elevation_1 = elevation_1_1;
            },
            function (details_1_1) {
                details_1 = details_1_1;
            }],
        execute: function() {
            Route = (function () {
                function Route(appData) {
                    this.details = appData.details;
                    this.track = appData.track;
                    this.elevation = appData.elevation;
                    this.markers = appData.markers;
                }
                return Route;
            }());
            exports_1("Route", Route);
            RouteObserver = (function () {
                function RouteObserver(store) {
                    this.store = store;
                    this.details$ = store.select('details');
                    this.track$ = store.select('track');
                    this.elevation$ = store.select('elevation');
                    this.searchResults$ = store.select('results');
                }
                RouteObserver.prototype.setRoute = function (route) {
                    var box = boundingRectangle(route.track), payload = Object.assign({}, route.details, {
                        lat: box.lat,
                        lon: box.lon,
                        zoom: box.zoom,
                        distance: box.distance,
                        easting: 0,
                        northing: 0
                    });
                    this.store.dispatch({
                        type: details_1.SET_DETAILS,
                        payload: payload
                    });
                    this.store.dispatch({
                        type: markers_1.SET_MARKERS,
                        payload: route.markers
                    });
                    this.store.dispatch({
                        type: track_1.SET_TRACK,
                        payload: route.track
                    });
                    this.store.dispatch({
                        type: elevation_1.SET_ELEVATION,
                        payload: route.elevation
                    });
                };
                ;
                return RouteObserver;
            }());
            exports_1("RouteObserver", RouteObserver);
            exports_1("boundingRectangle", boundingRectangle = function (tracks) {
                var b = Object.assign({}, initialBounds), dist = 0, lastPoint = tracks[0].track[0], self = _this;
                tracks.forEach(function (s) {
                    s.track.forEach(function (t) {
                        b.minLat = Math.min(b.minLat, t.lat);
                        b.maxLat = Math.max(b.maxLat, t.lat);
                        b.minLon = Math.min(b.minLon, t.lon);
                        b.maxLon = Math.max(b.maxLon, t.lon);
                        dist += distanceBetween(lastPoint.lat, lastPoint.lon, t.lat, t.lon);
                        lastPoint = t;
                    });
                });
                var mapCentre = centre(b.minLat, b.minLon, b.maxLat, b.maxLon), 
                //diagonal = distanceBetween(b.minLat, b.minLon, b.maxLat, b.maxLon),
                zoom = getZoomLevel(b.minLat, b.minLon, b.maxLat, b.maxLon);
                return { lat: mapCentre.lat, lon: mapCentre.lon, zoom: zoom, distance: dist };
            });
            exports_1("distance", distance = function (tracks) {
                if (tracks.length === 0) {
                    return 0;
                }
                var dist = 0, lastPoint = (tracks[0].waypoint !== null) ? tracks[0].waypoint : tracks[0].track[0];
                tracks.forEach(function (s) {
                    s.track.forEach(function (t) {
                        dist += distanceBetween(lastPoint.lat, lastPoint.lon, t.lat, t.lon);
                        lastPoint = t;
                    });
                });
                return dist;
            });
            initialBounds = {
                minLat: 1000000,
                minLon: 1000000,
                maxLat: -1000000,
                maxLon: -1000000
            };
            centre = function (lat1, lon1, lat2, lon2) {
                return {
                    lat: lat1 + ((lat2 - lat1) / 2),
                    lon: lon1 + ((lon2 - lon1) / 2)
                };
            };
            // Return distance (km) between two points
            exports_1("distanceBetween", distanceBetween = function (lat1, lon1, lat2, lon2) {
                var p = 0.017453292519943295; // Math.PI / 180
                var c = Math.cos;
                var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                    c(lat1 * p) * c(lat2 * p) *
                        (1 - c((lon2 - lon1) * p)) / 2;
                return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
            });
            getZoomLevel = function (lat1, lon1, lat2, lon2) {
                var toolbarHeight = 111, wHeight = window.innerHeight - toolbarHeight, wWidth = window.innerWidth, pixelDensity, osPixelMap = [1, 2, 5, 10, 20, 40, 100, 200, 500, 1000], z = 1;
                // Establish box height and width
                var bHeight = distanceBetween(lat1, lon1, lat2, lon1), bWidth = distanceBetween(lat1, lon1, lat1, lon2);
                // Find out the minimum pixel density - height or width
                pixelDensity = Math.min((wHeight / bHeight), (wWidth / bWidth));
                while (pixelDensity > osPixelMap[z]) {
                    z++;
                }
                return z;
            };
        }
    }
});
//# sourceMappingURL=route.js.map