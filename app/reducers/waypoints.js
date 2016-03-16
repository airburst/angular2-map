System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR, SET, ADD, REMOVE, waypoints;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR", CLEAR = 'CLEAR');
            exports_1("SET", SET = 'SET');
            exports_1("ADD", ADD = 'ADD');
            exports_1("REMOVE", REMOVE = 'REMOVE');
            exports_1("waypoints", waypoints = function (state, action) {
                if (state === void 0) { state = []; }
                switch (action.type) {
                    case SET:
                        console.log('WAYPOINTS.SET');
                        return action.payload;
                    case ADD:
                        console.log('WAYPOINTS.ADD');
                        return state.concat([action.payload]);
                    case REMOVE:
                        console.log('WAYPOINTS.REMOVE');
                        // Need to get trackPointsCount and 
                        // slice that number of points..
                        return state.slice(0, state.length - 1);
                    case CLEAR:
                        console.log('WAYPOINTS.CLEAR');
                        return [];
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=waypoints.js.map