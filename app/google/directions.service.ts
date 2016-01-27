///<reference path="../../typings/window.extend.d.ts"/>
import {Injectable} from 'angular2/core';
import {Point, MapPoint, WayPoint, Marker, Route} from '../route';

@Injectable()
export class DirectionsService {
    
    private service: any = {};
    
    init():void {
        this.service = new window.google.maps.DirectionsService();
    }
    
    // Use the latest and previous points on map to make a call to the Google
    // directions service, which returns a path that follows roads.
    // $scope.snapToRoad = function() {
    //     // Use last two waypoints
    //     var from = $scope.waypoints[$scope.waypoints.length - 2].gmap,
    //         to   = $scope.waypoints[$scope.waypoints.length - 1].gmap;

    //     // Try to get a path which follows roads
    //     $scope.directionsService.route({
    //         origin: from,
    //         destination: to,
    //         travelMode: google.maps.DirectionsTravelMode.BICYCLING
    //     }, function(result, status) {
    //         if (status == google.maps.DirectionsStatus.OK) {
    //             $scope.updateSnappedRoute(result);
    //         } else {
    //             $scope.showToast('There was a problem getting directions data: ' + status, 'Directions Service Error');
    //         }
    //     });
    // };

    // $scope.updateSnappedRoute = function(routeData) {
    //     var i,
    //         len = routeData.routes[0].overview_path.length,
    //         l,
    //         p;

    //     // Append the new points into route and elevation collections
    //     for (i = 0; i < len; i++) {
    //         $scope.elevationRoute.push(routeData.routes[0].overview_path[i]);

    //         // Convert from LatLng to point  TODO: move into function
    //         l = new OpenLayers.LonLat(routeData.routes[0].overview_path[i].lng(), routeData.routes[0].overview_path[i].lat());
    //         p = $scope.gridProjection.getMapPointFromLonLat(l);
    //         $scope.route.push(new OpenLayers.Geometry.Point(p.lon, p.lat));
    //     }

    //     // Update the number of route points in waypoints collection
    //     $scope.waypoints[$scope.waypoints.length - 1].routePoints = len;

    //     // Draw the route
    //     $scope.drawRoute();
    //     $scope.drawProfile();
    // };
}
