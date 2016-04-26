System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CLEAR_RESULTS, SET_RESULTS, results;
    return {
        setters:[],
        execute: function() {
            exports_1("CLEAR_RESULTS", CLEAR_RESULTS = 'CLEAR_RESULTS');
            exports_1("SET_RESULTS", SET_RESULTS = 'SET_RESULTS');
            exports_1("results", results = function (state, action) {
                if (state === void 0) { state = []; }
                switch (action.type) {
                    case SET_RESULTS:
                        return action.payload;
                    case CLEAR_RESULTS:
                        return (state = []);
                    default:
                        return state;
                }
            });
        }
    }
});
//# sourceMappingURL=gazetteer.js.map