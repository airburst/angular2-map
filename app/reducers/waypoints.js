System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR_WAYPOINTS, SET_WAYPOINTS, ADD_WAYPOINT, UPDATE_LAST_WAYPOINT, REMOVE_WAYPOINT, waypoints;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR_WAYPOINTS", CLEAR_WAYPOINTS = 'CLEAR_WAYPOINTS');
            exports_1("SET_WAYPOINTS", SET_WAYPOINTS = 'SET_WAYPOINTS');
            exports_1("ADD_WAYPOINT", ADD_WAYPOINT = 'ADD_WAYPOINT');
            exports_1("UPDATE_LAST_WAYPOINT", UPDATE_LAST_WAYPOINT = 'UPDATE_LAST_WAYPOINT');
            exports_1("REMOVE_WAYPOINT", REMOVE_WAYPOINT = 'REMOVE_WAYPOINT');
            exports_1("waypoints", waypoints = function (state, action) {
                if (state === void 0) { state = []; }
                console.log(action.type);
                switch (action.type) {
                    case SET_WAYPOINTS:
                        return action.payload;
                    case ADD_WAYPOINT:
                        return state.concat([action.payload]);
                    case UPDATE_LAST_WAYPOINT:
                        var lastWaypoint = state[state.length - 1];
                        lastWaypoint.trackPointsCount = action.payload.trackPointsCount;
                        return state;
                    case REMOVE_WAYPOINT:
                        // Need to get trackPointsCount and 
                        // slice that number of points..
                        return state.slice(0, state.length - 1);
                    case CLEAR_WAYPOINTS:
                        return [];
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=waypoints.js.map