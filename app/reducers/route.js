System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR, SET, ADD_POINT, waypoints;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR", CLEAR = 'CLEAR');
            exports_1("SET", SET = 'SET');
            exports_1("ADD_POINT", ADD_POINT = 'ADD_POINT');
            exports_1("waypoints", waypoints = function (state, _a) {
                if (state === void 0) { state = []; }
                var type = _a.type, payload = _a.payload;
                switch (type) {
                    case SET:
                        return payload;
                    case ADD_POINT:
                        return state.concat([payload]);
                    case CLEAR:
                        return [];
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=route.js.map