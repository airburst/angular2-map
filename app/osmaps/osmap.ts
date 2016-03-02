///<reference path="../../typings/window.extend.d.ts"/>
import {Component, EventEmitter, Input} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Point, MapPoint, WayPoint, Marker, Route} from '../route';
import {settings} from '../config/config';

@Component({
    selector: 'map',
    template: '<div id="map">{{route.name}}</div>'
})

export class OsMap {
    
    @Input() route: Route;
    
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
    
    constructor() {}
    
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
        // this.osMap.events.register('touchend', this.osMap, this.touchPoint);
        // this.osMap.events.register('click', this.osMap, this.clickPoint);
    };
    
    centreMap(easting?: number, northing?: number, zoom?: number): void {
        if (easting !== undefined) { this.easting = easting; }
        if (northing !== undefined) { this.northing = northing; }
        if (zoom !== undefined) { this.zoom = zoom; }
        this.osMap.setCenter(
            new this.os.MapPoint(this.easting, this.northing),
            this.zoom
        );
    };
    
    // Convert OpenSpace Point into Google LatLng
    // $scope.pointToGoogle = function(point) {
    //     var ll = $scope.gridProjection.getLonLatFromMapPoint(point);
    //     return new google.maps.LatLng(ll.lat, ll.lon);
    // };

    convertToOsMapPoint(point: Point) {
        let mp = new this.ol.LonLat(point.lon, point.lat),
            mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
        return new this.ol.Geometry.Point(mapPoint.lon, mapPoint.lat);
    };
    
    convertToOsPathFormat(route: Point[]): MapPoint[] {
        let path: MapPoint[] = [];
        route.forEach((point) => { path.push(this.convertToOsMapPoint(point)); });
        return path;
    }
    
    calculateDistanceInKm(route: Point[]): number {
        let distString = new this.ol.Geometry.Curve(this.convertToOsPathFormat(route));
        return (distString.getLength() / 1000);
    }
    
    // Draw path as a vector layer
    draw(route: Route): void {
        console.log(this.route);
        let routeStyle: any = settings.routeStyle,
            waypointsFeature: WayPoint[] = [],
            markersFeature: Marker[] = [];

        let path = this.convertToOsPathFormat(route.points);

        // Set the lines array (line segments in route)
        let routeFeature = new this.ol.Feature.Vector(
            new this.ol.Geometry.LineString(path),
            null,
            routeStyle
        );

        // Add waypoints (editable)
        route.wayPoints.forEach((w: WayPoint) => {
            waypointsFeature.push(
                new this.ol.Feature.Vector(this.convertToOsMapPoint(w.point))
            );
        });
        
        // Add route markers
        route.markers.forEach((m: Marker) => {
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
            { description: marker.name },           /* Attributes */
            {                                       /* Style */
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