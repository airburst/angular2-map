///<reference path="../../typings/window.extend.d.ts"/>
import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Point, MapPoint, WayPoint, Marker} from '../route';
import {settings} from '../config/config';

@Component({
    selector: 'map',
    template: '<div id="map"></div>',
    directives: [FORM_DIRECTIVES],
    styles: [`
        #map: {
            width: 100%;
            height: 400px;
        }
    `]
})

export class OsMap {    
    easting: number = 386210;
    northing: number = 168060;
    zoom: number = 7;
    osMap: any = {};
    lineVectorLayer: any = {};
    pointVectorLayer: any = {};
    markerVectorLayer: any = {};
    gazetteer: any = {};
    gridProjection: any = {};
    
    init() {
        // Instantiate the map canvas
        let options = {
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
        let position = new window.OpenSpace.Control.ControlPosition(
            window.OpenSpace.Control.ControlAnchor.ANCHOR_TOP_LEFT,
            new window.OpenLayers.Size(0, 100)
        );
        this.osMap.addControl(
            new window.OpenSpace.Control.LargeMapControl(),
            position
        );
        
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
    
    centreMap(easting?: number, northing?: number, zoom?: number): void {
        if (easting !== undefined) { this.easting = easting; }
        if (northing !== undefined) { this.northing = northing; }
        if (zoom !== undefined) { this.zoom = zoom; }
        this.osMap.setCenter(
            new window.OpenSpace.MapPoint(this.easting, this.northing),
            this.zoom
        );
    };
    
    // Convert OpenSpace Point into Google LatLng
    // $scope.pointToGoogle = function(point) {
    //     var ll = $scope.gridProjection.getLonLatFromMapPoint(point);
    //     return new google.maps.LatLng(ll.lat, ll.lon);
    // };

    // Convert Point into OpenSpace MapPoint
    convertToMapPoint(point: Point) {
        let mp = new window.OpenLayers.LonLat(point.lon, point.lat),
            mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
        return new window.OpenLayers.Geometry.Point(mapPoint.lon, mapPoint.lat);
    };
    
    // Convert Route into OpenSpace Path
    toPath(route: Point[]): MapPoint[] {
        let path: MapPoint[] = [];
        route.forEach((point) => { path.push(this.convertToMapPoint(point)); });
        return path;
    }
    
    // Calculate total distance in km
    getDistance(route: Point[]): number {
        // Convert route into MapPoints
        let distString = new window.OpenLayers.Geometry.Curve(this.toPath(route));
        return (distString.getLength() / 1000);
    }
    
    // Draw path as a vector layer
    drawPath(route: any): void {
        let routeStyle: any = settings.routeStyle,
            waypointsFeature: WayPoint[] = [];

        // Convert route into OS path format
        let path = this.toPath(route.points);

        // Set the lines array (line segments in route)
        let routeFeature = new window.OpenLayers.Feature.Vector(
            new window.OpenLayers.Geometry.LineString(path),
            null,
            routeStyle
        );

        // Add waypoint markers
        route.waypoints.forEach((w) => {
            waypointsFeature.push(new window.OpenLayers.Feature.Vector(w.point));
        });

        // Replace the existing layer
        this.pointVectorLayer.destroyFeatures();
        this.pointVectorLayer.addFeatures(waypointsFeature);
        this.lineVectorLayer.destroyFeatures();
        this.lineVectorLayer.addFeatures([routeFeature]);
    }
}