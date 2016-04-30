System.register(['angular2/core', '@ngrx/store', '../models/route', '../utils/utils', '../reducers/details'], function(exports_1, context_1) {
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
    var core_1, store_1, route_1, utils_1, details_1;
    var GpxService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (route_1_1) {
                route_1 = route_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (details_1_1) {
                details_1 = details_1_1;
            }],
        execute: function() {
            GpxService = (function () {
                function GpxService(store) {
                    this.store = store;
                    this.template = {
                        header: '<?xml version="1.0" encoding="UTF-8"?>' +
                            '<gpx creator="maps.fairhursts.net" version="1.1" xmlns="http://www.topografix.com/GPX/1/1">',
                        title: '<metadata><name>{name}</name></metadata><trk><name>{name}</name>',
                        point: '<trkpt lon="{lon}" lat="{lat}">' +
                            '<ele>{ele}</ele>' +
                            '</trkpt>',
                        end: '</trk></gpx>'
                    };
                }
                GpxService.prototype.init = function () {
                    this.appStore = {
                        details: Object.assign({}, details_1.initialState),
                        track: [],
                        elevation: [],
                        markers: []
                    };
                    this.routeObserver = new route_1.RouteObserver(this.store);
                };
                GpxService.prototype.read = function (gpxData) {
                    var route = gpxData[0], name = gpxData[1], ext = gpxData[2];
                    this.init();
                    try {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(route, 'text/xml');
                        // Parse the file dependent on type
                        if (ext === 'gpx') {
                            this.gpxToRoute(xmlDoc);
                        }
                        if (ext === 'tcx') {
                            this.tcxToRoute(xmlDoc);
                        }
                    }
                    catch (err) {
                        console.log(err);
                        return (err);
                    }
                };
                GpxService.prototype.gpxToRoute = function (xml) {
                    // Route Name (gpx/metadata/name)
                    var meta = xml.getElementsByTagName('metadata')[0];
                    this.appStore.details.name = ((meta.getElementsByTagName('name')[0]) !== undefined) ? meta.getElementsByTagName('name')[0].textContent : '';
                    // Waypoints (gpx/wpt[@lat, @lon, name]) -> Markers
                    var wayPoints = xml.getElementsByTagName('wpt');
                    for (var i = 0; i < wayPoints.length; i++) {
                        var marker = {
                            name: wayPoints[i].getElementsByTagName('name')[0].textContent,
                            point: {
                                lat: parseFloat(wayPoints[i].getAttribute('lat').valueOf()),
                                lon: parseFloat(wayPoints[i].getAttribute('lon').valueOf())
                            }
                        };
                        this.appStore.markers.push(marker);
                    }
                    // Track Points (gpx/trk/trkseg/trkpt[@lat, @lon, ele])
                    var trackPoints = xml.getElementsByTagName('trkpt'), track = [], elevation = [];
                    for (var i = 0; i < trackPoints.length; i++) {
                        var point = {
                            lat: parseFloat(trackPoints[i].getAttribute('lat').valueOf()),
                            lon: parseFloat(trackPoints[i].getAttribute('lon').valueOf()),
                        };
                        track.push(point);
                        elevation.push(parseFloat(trackPoints[i].getElementsByTagName('ele')[0].textContent));
                    }
                    this.appStore.track.push({ id: 'imported', track: track, waypoint: null, hasElevationData: true });
                    this.appStore.elevation.push(elevation);
                    this.appStore.details.isEditable = true;
                    this.appStore.details.hasNewElevation = false;
                    this.route = new route_1.Route(this.appStore);
                    this.routeObserver.setRoute(this.route);
                };
                // TODO: understand the full schema:
                // http://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
                // This function only handles course[0], not activities or multiple courses
                GpxService.prototype.tcxToRoute = function (xml) {
                    // Course Name (Course/Name)
                    var course = xml.getElementsByTagName('Course')[0];
                    this.appStore.details.name = ((course.getElementsByTagName('Name')[0]) !== undefined) ? course.getElementsByTagName('Name')[0].textContent : '';
                    // Track Points (Track/Trackpoint[Position/LatitudeDegrees, Position/LongitudeDegrees, AltitudeMeters])
                    var trackPoints = xml.getElementsByTagName('Trackpoint'), track = [], elevation = [];
                    for (var i = 0; i < trackPoints.length; i++) {
                        var point = {
                            lat: parseFloat(trackPoints[i].getElementsByTagName('LatitudeDegrees')[0].textContent),
                            lon: parseFloat(trackPoints[i].getElementsByTagName('LongitudeDegrees')[0].textContent)
                        };
                        track.push(point);
                        elevation.push(parseFloat(trackPoints[i].getElementsByTagName('AltitudeMeters')[0].textContent));
                    }
                    this.appStore.track.push({ id: 'imported', track: track, waypoint: null, hasElevationData: true });
                    this.appStore.elevation.push(elevation);
                    // Markers - add start and finish points
                    // TODO: find out whether courses support waypoints
                    this.appStore.markers.push({ name: 'Start', point: track[0] });
                    this.appStore.markers.push({ name: 'Finish', point: track[track.length - 1] });
                    this.appStore.details.isEditable = true;
                    this.appStore.details.hasNewElevation = false;
                    this.route = new route_1.Route(this.appStore);
                    this.routeObserver.setRoute(this.route);
                };
                GpxService.prototype.write = function (name) {
                    var _this = this;
                    if (name === undefined) {
                        name = 'Route';
                    }
                    var gpxContent = this.template.header + utils_1.replaceAll('{name}', name, this.template.title), e = utils_1.flatten(this.store.getState().elevation), eIndex = 0;
                    this.store.getState().track.forEach(function (segment) {
                        segment.track.forEach(function (t) {
                            gpxContent += _this.template.point
                                .replace('{lat}', t.lat.toFixed(7))
                                .replace('{lon}', t.lon.toFixed(7))
                                .replace('{ele}', e[eIndex++].toFixed(1));
                        });
                    });
                    gpxContent += this.template.end;
                    return gpxContent;
                };
                GpxService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [store_1.Store])
                ], GpxService);
                return GpxService;
            }());
            exports_1("GpxService", GpxService);
        }
    }
});
//# sourceMappingURL=gpx.service.js.map