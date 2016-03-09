System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function counter(state, action) {
        if (state === void 0) { state = 0; }
        switch (action.type) {
            case 'INCREMENT':
                return state + 1;
            case 'DECREMENT':
                return state - 1;
            default:
                return state;
        }
    }
    exports_1("counter", counter);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=counter.js.map