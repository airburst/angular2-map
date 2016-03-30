System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR_MARKERS, SET_MARKERS, ADD_MARKER, REMOVE_MARKER, markers;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR_MARKERS", CLEAR_MARKERS = 'CLEAR_MARKERS');
            exports_1("SET_MARKERS", SET_MARKERS = 'SET_MARKERS');
            exports_1("ADD_MARKER", ADD_MARKER = 'ADD_MARKER');
            exports_1("REMOVE_MARKER", REMOVE_MARKER = 'REMOVE_MARKER');
            exports_1("markers", markers = function (state, action) {
                if (state === void 0) { state = []; }
                switch (action.type) {
                    case SET_MARKERS:
                        return action.payload;
                    case ADD_MARKER:
                        return state.concat([action.payload]);
                    case REMOVE_MARKER:
                        return state.slice(0, state.length - 1);
                    case CLEAR_MARKERS:
                        return (state = []);
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=markers.js.map