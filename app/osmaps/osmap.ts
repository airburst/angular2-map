import {Component, EventEmitter, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';

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
        //this.centreMap(386210, 168060, 7);
        this.centreMap();
        
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
        // $scope.gazetteer = new OpenSpace.Gazetteer();

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
        console.log(this.easting, this.northing);
    };
}