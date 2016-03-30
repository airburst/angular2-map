import {Component, EventEmitter, Input, OnInit, Output} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Point, MapPoint, WayPoint, Marker, Segment, AppStore, Route, distance} from '../route';
import {uuid} from '../utils/utils';
import {DirectionsService} from '../google/directions.service';
import {settings} from '../config/config';
import {Store} from '@ngrx/store';
import {ADD_SEGMENT, UPDATE_SEGMENT, REMOVE_LAST_SEGMENT, CLEAR_TRACK} from '../reducers/track';
import {UPDATE_DETAILS} from '../reducers/details';

@Component({
    selector: 'map',
    template: '<div id="map"></div>'
})

export class OsMap {
    os: any = {};
    ol: any = {};
    osMap: any = {};
    lineVectorLayer: any = {};
    pointVectorLayer: any = {};
    markerVectorLayer: any = {};
    gridProjection: any = {};
    isMoving: boolean = false;
    route: Route;

    constructor(
        private directionsService: DirectionsService,
        public store: Store<AppStore>
    ) {
        this.route = new Route(store);
    }

    init() {
        this.ol = window.OpenLayers;
        this.os = window.OpenSpace;

        // Instantiate the map canvas
        let options = {
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
        this.gridProjection = new this.os.GridProjection();

        // Initialise the vector layers
        this.lineVectorLayer = new this.ol.Layer.Vector('Line Vector Layer');
        this.osMap.addLayer(this.lineVectorLayer);
        this.pointVectorLayer = new this.ol.Layer.Vector('Point Vector Layer');
        this.osMap.addLayer(this.pointVectorLayer);
        this.markerVectorLayer = new this.ol.Layer.Vector('Point Vector Layer');
        this.osMap.addLayer(this.markerVectorLayer);

        // Add controls
        let position = new this.os.Control.ControlPosition(
            this.os.Control.ControlAnchor.ANCHOR_TOP_LEFT,
            new this.ol.Size(0, 100)
        );
        this.osMap.addControl(
            new this.os.Control.LargeMapControl(),
            position
        );

        this.centreAndSetMapEvents();

        this.route.track$.subscribe((v) => {
            this.draw(v);
            this.updateDistance(v);
        });
    };

    centreAndSetMapEvents() {
        this.centreMap(this.store.getState().details);
        this.osMap.events.remove('dblclick');
        this.osMap.events.register('touchmove', this.osMap, function() { console.log('setting isMoving to true'); this.isMoving = true; });
        this.osMap.events.register('touchend', this.osMap, this.touchPoint.bind(this));
        this.osMap.events.register('click', this.osMap, this.clickPoint.bind(this));
    }

    removeMapEvents() {
        this.osMap.events.remove('touchmove');
        this.osMap.events.remove('touchend');
        this.osMap.events.remove('click');
    }

    touchPoint(e) {
        if (this.isMoving) {
            this.isMoving = false;
            return;
        }

        let p = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        },
            pt = this.osMap.getLonLatFromViewPortPx(p);
        this.addWayPointToMap(e, pt);
    };

    clickPoint(e) {
        var pt = this.osMap.getLonLatFromViewPortPx(e.xy);
        this.addWayPointToMap(e, pt);
    };

    addWayPointToMap(e, pt) {
        let p: Point = this.convertToLatLng(pt),
            uid = uuid();

        this.store.dispatch({
            type: ADD_SEGMENT,
            payload: { id: uid, waypoint: { lat: p.lat, lon: p.lon, ele: 0 }, track: [], hasElevationData: false }
        });

        // Get value from Observable
        let track = this.store.getState().track;

        if ((this.store.getState().details.followsRoads) && (track.length > 1)) {
            let fp = track[track.length - 2].waypoint,
                from = this.directionsService.convertToGoogleMapPoint(fp),
                tp = track[track.length - 1].waypoint,
                to = this.directionsService.convertToGoogleMapPoint(tp);

            this.directionsService.getRouteBetween(from, to)
                .then((response) => {
                    this.store.dispatch({
                        type: UPDATE_SEGMENT,
                        payload: { id: uid, track: response }
                    });
                }, function(response) {
                    console.error('Problem with directions service:', response)
                });

        }
        this.ol.Event.stop(e);
    };

    convertToLatLng(point): Point {
        let ll = this.gridProjection.getLonLatFromMapPoint(point);
        return { lat: ll.lat, lon: ll.lon };
    };

    centreMap(options?: any): void {
        if (options !== undefined) {
            let mp, p;
            if (options.lat !== 0) {
                p = this.convertToOsMapPoint({ lat: options.lat, lon: options.lon });
                mp = new this.os.MapPoint(p.x, p.y);
            } else {
                mp = new this.os.MapPoint(options.easting, options.northing);
            }
            this.osMap.setCenter(mp, options.zoom);
        }
    };

    draw(track: Segment[]): void {
        let path = this.convertRouteToOsFormat(track);

        // Plot route layer
        let routeFeature = new this.ol.Feature.Vector(
            new this.ol.Geometry.LineString(path), null, settings.routeStyle
        );

        // Plot waypoints layer
        let waypointsFeature: Point[] = [];
        track.forEach((s: Segment) => {
            if (s.waypoint !== null) {
                waypointsFeature.push(
                    new this.ol.Feature.Vector(this.convertToOsMapPoint(s.waypoint))
                );
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
    };

    updateDistance(track: Segment[]): void {
        let dist = distance(track);
        this.store.dispatch({
            type: UPDATE_DETAILS,
            payload: { distance: dist }
        });
    }

    convertRouteToOsFormat(track: Segment[]): MapPoint[] {
        let path: MapPoint[] = [];
        track.forEach((segment) => {
            segment.track.forEach((point) => {
                path.push(this.convertToOsMapPoint(point));
            });
        });
        return path;
    }

    convertToOsMapPoint(point: Point) {
        let mp = new this.ol.LonLat(point.lon, point.lat),
            mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
        return new this.ol.Geometry.Point(mapPoint.lon, mapPoint.lat);
    };

    addMarker(marker: Marker, image: string): any {
        return new this.ol.Feature.Vector(
            this.convertToOsMapPoint(marker.point),   /* Geometry */
            { description: marker.name },             /* Attributes */
            {                                         /* Style */
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
            }
        );
    };

}