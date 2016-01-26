System.register([], function(exports_1) {
    var settings;
    return {
        setters:[],
        execute: function() {
            exports_1("settings", settings = {
                url: 'http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js',
                key: 'A73F02BD5E3B3B3AE0405F0AC8602805',
                osMapUrl: function () {
                    return this.url + '?key=' + this.key;
                }
            });
        }
    }
});
//# sourceMappingURL=config.js.map