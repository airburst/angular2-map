System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR_DETAILS, SET_DETAILS, UPDATE_DETAILS, TOGGLE_ROADS, initialState, details;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR_DETAILS", CLEAR_DETAILS = 'CLEAR_DETAILS');
            exports_1("SET_DETAILS", SET_DETAILS = 'SET_DETAILS');
            exports_1("UPDATE_DETAILS", UPDATE_DETAILS = 'UPDATE_DETAILS');
            exports_1("TOGGLE_ROADS", TOGGLE_ROADS = 'TOGGLE_ROADS');
            exports_1("initialState", initialState = {
                name: "",
                distance: 0,
                ascent: 0,
                easting: 386210,
                northing: 168060,
                lat: 0,
                lon: 0,
                zoom: 7,
                followsRoads: true,
                isEditable: false,
                hasNewElevation: true,
                selectedPointIndex: -1
            });
            exports_1("details", details = function (state, action) {
                if (state === void 0) { state = initialState; }
                switch (action.type) {
                    case SET_DETAILS:
                        return Object.assign({}, state, action.payload);
                    case UPDATE_DETAILS:
                        return Object.assign({}, state, action.payload);
                    case CLEAR_DETAILS:
                        return (state = initialState);
                    case TOGGLE_ROADS:
                        return Object.assign({}, state, { followsRoads: !state.followsRoads });
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=details.js.map