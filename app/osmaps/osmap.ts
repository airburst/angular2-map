import {Component, EventEmitter, Input, OnInit, Output} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Point, MapPoint, WayPoint, Marker, Route, AppStore} from '../route';
import {DirectionsService} from '../google/directions.service';
import {settings} from '../config/config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Store} from '@ngrx/store';
import {ADD_WAYPOINT, UPDATE_LAST_WAYPOINT} from '../reducers/waypoints';

@Component({
    selector: 'map',
    template: '<div id="map"></div>'
})

export class OsMap {
    easting: number = 386210;
    northing: number = 168060;
    zoom: number = 7;
    os: any = {};
    ol: any = {};
    osMap: any = {};
    lineVectorLayer: any = {};
    pointVectorLayer: any = {};
    markerVectorLayer: any = {};
    gridProjection: any = {};
    isMoving: boolean = false;
    route: Route;
    followsRoads: boolean = true;
    waypoints: Observable<Array<WayPoint>>;
    
    constructor(
        private directionsService: DirectionsService,
        public store: Store<AppStore>
    ) {
        this.route = new Route();
        this.waypoints = store.select('waypoints');
    }
    
    init() {
        this.ol = window.OpenLayers;
        this.os = window.OpenSpace;

        this.waypoints.subscribe(v => console.log(v));        
        
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
        let position = new this.os.Control.ControlPosition(
            this.os.Control.ControlAnchor.ANCHOR_TOP_LEFT,
            new this.ol.Size(0, 100)
        );
        this.osMap.addControl(
            new this.os.Control.LargeMapControl(),
            position
        );
        
        // Add map event handlers for touch and click
        this.osMap.events.remove('dblclick');
        this.osMap.events.register('touchmove', this.osMap, function() { this.isMoving = true; });
        this.osMap.events.register('touchend', this.osMap, this.touchPoint.bind(this));
        this.osMap.events.register('click', this.osMap, this.clickPoint.bind(this));
    };
    
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
        let p: Point = this.convertToLatLng(pt);

        this.route.addWayPoint({point: {lat: p.lat, lon: p.lon}, trackPointsCount: 1});     //REMOVE

        //MF
        this.store.dispatch({
            type: ADD_WAYPOINT, 
            payload: { point: { lat: p.lat, lon: p.lon, ele: 0 }, trackPointsCount: 1 }
        });

        // this.store.dispatch({
        //     type: UPDATE_LAST_WAYPOINT,
        //     payload: {trackPointsCount: 100}            
        // })
            
        if ((this.followsRoads) && (this.route.wayPoints.length > 1)) {
            let fp = this.route.penultimateWayPoint().point,
                from = this.directionsService.convertToGoogleMapPoint(fp),
                tp = this.route.lastWayPoint().point,
                to = this.directionsService.convertToGoogleMapPoint(tp);
                
            this.directionsService.getRouteBetween(from, to)
                .then((response) => {
                    this.route.addPoints(response);
                    this.route.lastWayPoint().trackPointsCount = response.length;
                    this.draw();
                }, function(response) {
                    console.error('Problem with directions service:', response)
                });

        } else {
            this.route.addPoint(p);
            this.draw();
        }

        this.ol.Event.stop(e);
    };
    
    convertToLatLng(point): Point {
        let ll = this.gridProjection.getLonLatFromMapPoint(point);
        return {lat: ll.lat, lon: ll.lon};
    };
    
    drawWholeRoute() {
        let centre = this.convertToOsMapPoint(this.route.centre());
        this.centreMap(centre.x, centre.y, this.route.getZoomLevel());
        this.draw();
    };
    
    centreMap(easting?: number, northing?: number, zoom?: number): void {
        if (easting !== undefined) { this.easting = easting; }
        if (northing !== undefined) { this.northing = northing; }
        if (zoom !== undefined) { this.zoom = zoom; }
        this.osMap.setCenter(new this.os.MapPoint(this.easting, this.northing), this.zoom);
    };
    
    draw(): void {
        let path = this.convertRouteToOsFormat();

        // Plot route layer
        let routeFeature = new this.ol.Feature.Vector(
            new this.ol.Geometry.LineString(path), null, settings.routeStyle
        );

        // Plot waypoints layer
        let waypointsFeature: WayPoint[] = [];
        this.route.wayPoints.forEach((w: WayPoint) => {
            waypointsFeature.push(
                new this.ol.Feature.Vector(this.convertToOsMapPoint(w.point))
            );
        });
        
        // Plot route markers layer
        let markersFeature: Marker[] = [];
        this.route.markers.forEach((m: Marker) => {
            markersFeature.push(this.addMarker(m, 'dist/assets/images/map-marker.png'));
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
      
    convertRouteToOsFormat(): MapPoint[] {
        let path: MapPoint[] = [];
        this.route.points.forEach((point) => {
            path.push(this.convertToOsMapPoint(point));
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
                label:              marker.name,
                labelAlign:         'l',
                labelXOffset:       16,
                labelYOffset:       32,
                fontFamily:         'Arial',
                fontColor:          'black',
                fontSize:           '0.7em',
                externalGraphic:    image,
                graphicHeight:      32,
                graphicWidth:       32,
                graphicXOffset:     -16,
                graphicYOffset:     -32
            }
        );
    };
    
    calculateDistanceInKm(): number {
        let distString = new this.ol.Geometry.Curve(this.convertRouteToOsFormat());
        return (distString.getLength() / 1000);
    }
}