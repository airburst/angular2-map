System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR_DETAILS, SET_DETAILS, UPDATE_DETAILS, initialState, details;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR_DETAILS", CLEAR_DETAILS = 'CLEAR_DETAILS');
            exports_1("SET_DETAILS", SET_DETAILS = 'SET_DETAILS');
            exports_1("UPDATE_DETAILS", UPDATE_DETAILS = 'UPDATE_DETAILS');
            exports_1("initialState", initialState = {
                name: '',
                distance: 0,
                ascent: 0,
                descent: 0,
                easting: 386210,
                northing: 168060,
                zoom: 7,
                followsRoads: true,
                isImported: false
            });
            exports_1("details", details = function (state, action) {
                if (state === void 0) { state = initialState; }
                switch (action.type) {
                    case SET_DETAILS:
                        return action.payload;
                    case UPDATE_DETAILS:
                        return Object.assign({}, state, action.payload);
                    case CLEAR_DETAILS:
                        return initialState;
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=details.js.map