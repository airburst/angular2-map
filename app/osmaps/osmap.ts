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
    os: any = {};
    ol: any = {};
    osMap: any = {};
    lineVectorLayer: any = {};
    pointVectorLayer: any = {};
    markerVectorLayer: any = {};
    gazetteer: any = {};
    gridProjection: any = {};
    
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
        
        // // Add map event handlers for touch and click
        // $scope.osMap.events.remove('dblclick');
        // $scope.osMap.events.register('touchmove', $scope.osMap, function() { $scope.dragging = true; });
        // $scope.osMap.events.register('touchend', $scope.osMap, $scope.touchPoint);
        // $scope.osMap.events.register('click', $scope.osMap, $scope.clickPoint);

        // Initialise gazetteer
        this.gazetteer = new this.os.Gazetteer();
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

    // Convert Point into OpenSpace MapPoint
    convertToMapPoint(point: Point) {
        let mp = new this.ol.LonLat(point.lon, point.lat),
            mapPoint = this.gridProjection.getMapPointFromLonLat(mp);
        return new this.ol.Geometry.Point(mapPoint.lon, mapPoint.lat);
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
        let distString = new this.ol.Geometry.Curve(this.toPath(route));
        return (distString.getLength() / 1000);
    }
    
    // Draw path as a vector layer
    drawPath(route: any): void {
        let routeStyle: any = settings.routeStyle,
            waypointsFeature: WayPoint[] = [],
            markersFeature: Marker[] = [];

        // Convert route into OS path format
        let path = this.toPath(route.points);

        // Set the lines array (line segments in route)
        let routeFeature = new this.ol.Feature.Vector(
            new this.ol.Geometry.LineString(path),
            null,
            routeStyle
        );

        // Add waypoints (editable)
        route.waypoints.forEach((w: WayPoint) => {
            waypointsFeature.push(
                new this.ol.Feature.Vector(this.convertToMapPoint(w.point))
            );
        });
        
        // Add route markers
        route.markers.forEach((m: Marker) => {
            markersFeature.push(this.addMarker(m, 'dist/assets/images/map-marker.png'))
        });

        // Replace the existing layer
        this.pointVectorLayer.destroyFeatures();
        this.pointVectorLayer.addFeatures(waypointsFeature);
        this.lineVectorLayer.destroyFeatures();
        this.lineVectorLayer.addFeatures([routeFeature]);
        this.markerVectorLayer.destroyFeatures();
        this.markerVectorLayer.addFeatures(markersFeature);
    }
    
    addMarker(marker: Marker, image: string): any {
        return new this.ol.Feature.Vector(
            this.convertToMapPoint(marker.point),
            { description: marker.name },
            {
                externalGraphic: image,
                graphicHeight:   32,
                graphicWidth:    32,
                graphicXOffset:  -16,
                graphicYOffset:  -32
            }
        );
    };
}