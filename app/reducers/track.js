System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR_TRACK, SET_TRACK, ADD_SEGMENT, UPDATE_SEGMENT, REMOVE_LAST_SEGMENT, track;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR_TRACK", CLEAR_TRACK = 'CLEAR_TRACK');
            exports_1("SET_TRACK", SET_TRACK = 'SET_TRACK');
            exports_1("ADD_SEGMENT", ADD_SEGMENT = 'ADD_SEGMENT');
            exports_1("UPDATE_SEGMENT", UPDATE_SEGMENT = 'UPDATE_SEGMENT');
            exports_1("REMOVE_LAST_SEGMENT", REMOVE_LAST_SEGMENT = 'REMOVE_LAST_SEGMENT');
            exports_1("track", track = function (state, action) {
                if (state === void 0) { state = []; }
                switch (action.type) {
                    case SET_TRACK:
                        return action.payload;
                    case ADD_SEGMENT:
                        return state.concat([action.payload]);
                    case UPDATE_SEGMENT:
                        return state.map(function (segment) {
                            return segment.id === action.payload.id ? Object.assign({}, segment, action.payload) : segment;
                        });
                    case REMOVE_LAST_SEGMENT:
                        // Need to get trackPointsCount and 
                        // slice that number of points..
                        return state.slice(0, state.length - 1);
                    case CLEAR_TRACK:
                        return [];
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=track.js.map