System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR_ELEVATION, SET_ELEVATION, ADD_ELEVATION, REMOVE_ELEVATION, elevation;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR_ELEVATION", CLEAR_ELEVATION = 'CLEAR_ELEVATION');
            exports_1("SET_ELEVATION", SET_ELEVATION = 'SET_ELEVATION');
            exports_1("ADD_ELEVATION", ADD_ELEVATION = 'ADD_ELEVATION');
            exports_1("REMOVE_ELEVATION", REMOVE_ELEVATION = 'REMOVE_ELEVATION');
            exports_1("elevation", elevation = function (state, action) {
                if (state === void 0) { state = []; }
                switch (action.type) {
                    case SET_ELEVATION:
                        return action.payload;
                    case ADD_ELEVATION:
                        return state.concat([action.payload]);
                    case REMOVE_ELEVATION:
                        return state.slice(0, state.length - 1);
                    case CLEAR_ELEVATION:
                        return [];
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=elevation.js.map