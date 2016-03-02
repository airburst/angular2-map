///<reference path="../../typings/window.extend.d.ts"/>
import {Component, EventEmitter, Input, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Point, MapPoint, WayPoint, Marker, Route} from '../route';
import {settings} from '../config/config';

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
    followsRoads: boolean = false;
    
    constructor() {
        this.route = new Route();
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
        this.addPointToMap(e, pt);
    };

    clickPoint(e) {
        var pt = this.osMap.getLonLatFromViewPortPx(e.xy);
        this.addPointToMap(e, pt);
    };
    
    addPointToMap(e, pt) {
        let clickedPoint = new this.ol.Geometry.Point(pt.lon, pt.lat);
        
        // if ((this.followsRoads) && (this.route.wayPoints.length > 1)) {
        //     // Try to use Google Directions API to make the route follow roads
        //     //this.snapToRoad();
        // } else {
            this.route.addPoint(clickedPoint);
            this.route.addWayPoint(new WayPoint(clickedPoint, 1));
        //}

        this.ol.Event.stop(e);
        this.draw();
    };
    
    // Convert OpenSpace Point into Google LatLng
    // $scope.pointToGoogle = function(point) {
    //     var ll = $scope.gridProjection.getLonLatFromMapPoint(point);
    //     return new google.maps.LatLng(ll.lat, ll.lon);
    // };
    
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
    
    calculateDistanceInKm(): number {
        let distString = new this.ol.Geometry.Curve(this.convertToOsPathFormat());
        return (distString.getLength() / 1000);
    }
    
    convertToOsPathFormat(): MapPoint[] {
        let path: MapPoint[] = [];
        this.route.points.forEach((point) => {
            path.push(this.convertToOsMapPoint(point));
        });
        return path;
    }
    
    convertToOsMapPoint(point: Point) {
        console.log(point)
        
        let mp = new this.ol.LonLat(point.lon, point.lat),
            mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
        return new this.ol.Geometry.Point(mapPoint.lon, mapPoint.lat);
    };

    draw(): void {
        console.log(this.route);
        let routeStyle: any = settings.routeStyle,
            waypointsFeature: WayPoint[] = [],
            markersFeature: Marker[] = [];

        let path = this.convertToOsPathFormat();
console.log(path);
        // Set the lines array (line segments in route)
        let routeFeature = new this.ol.Feature.Vector(
            new this.ol.Geometry.LineString(path), null, routeStyle
        );

        // Add waypoints
        this.route.wayPoints.forEach((w: WayPoint) => {
            waypointsFeature.push(
                new this.ol.Feature.Vector(this.convertToOsMapPoint(w.point))
            );
        });
        
        // Add route markers
        this.route.markers.forEach((m: Marker) => {
            markersFeature.push(this.addMarker(m, 'dist/assets/images/map-marker.png'));
        });

        // Replace the existing layer
        this.pointVectorLayer.destroyFeatures();
        this.pointVectorLayer.addFeatures(waypointsFeature);
        this.lineVectorLayer.destroyFeatures();
        this.lineVectorLayer.addFeatures([routeFeature]);
        this.markerVectorLayer.destroyFeatures();
        this.markerVectorLayer.addFeatures(markersFeature);
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
}