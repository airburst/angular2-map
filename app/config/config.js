System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var settings;
    return {
        setters:[],
        execute: function() {
            exports_1("settings", settings = {
                url: 'http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js',
                key: 'A73F02BD5E3B3B3AE0405F0AC8602805',
                osMapUrl: function () {
                    return this.url + '?key=' + this.key;
                },
                routeStyle: {
                    strokeColor: 'red',
                    strokeWidth: 4,
                    strokeOpacity: 0.7
                },
                // Google
                gMapUrl: 'http://maps.googleapis.com/maps/api/js?v=3.exp'
            });
        }
    }
});
//# sourceMappingURL=config.js.map