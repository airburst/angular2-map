System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Route;
    return {
        setters:[],
        execute: function() {
            Route = (function () {
                function Route(store) {
                    this.details$ = store.select('details');
                    this.track$ = store.select('track');
                    this.elevation$ = store.select('elevation');
                }
                return Route;
            }());
            exports_1("Route", Route);
        }
    }
});
//# sourceMappingURL=route.js.map