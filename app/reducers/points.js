System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR, SET, ADD, REMOVE, points;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR", CLEAR = 'CLEAR');
            exports_1("SET", SET = 'SET');
            exports_1("ADD", ADD = 'ADD');
            exports_1("REMOVE", REMOVE = 'REMOVE');
            exports_1("points", points = function (state, action) {
                if (state === void 0) { state = []; }
                switch (action.type) {
                    case SET:
                        console.log('POINTS.SET');
                        return action.payload;
                    case ADD:
                        console.log('POINTS.ADD');
                        return state.concat([action.payload]);
                    case REMOVE:
                        console.log('POINTS.REMOVE');
                        // Need to get trackPointsCount and 
                        // slice that number of points..
                        return state.slice(0, state.length - 1);
                    case CLEAR:
                        console.log('POINTS.CLEAR');
                        return [];
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=points.js.map