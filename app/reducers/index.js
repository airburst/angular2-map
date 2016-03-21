System.register(['./waypoints', './points', './track'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var waypoints_1, points_1, track_1;
    var reducers;
    return {
        setters:[
            function (waypoints_1_1) {
                waypoints_1 = waypoints_1_1;
            },
            function (points_1_1) {
                points_1 = points_1_1;
            },
            function (track_1_1) {
                track_1 = track_1_1;
            }],
        execute: function() {
            exports_1("reducers", reducers = {
                track: track_1.track,
                waypoints: waypoints_1.waypoints,
                points: points_1.points
            });
        }
    }
});
//# sourceMappingURL=index.js.map