System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var uuid;
    return {
        setters:[],
        execute: function() {
            exports_1("uuid", uuid = function () {
                return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11)
                    .replace(/1|0/g, function () {
                    return (0 | Math.random() * 16).toString(16);
                });
            });
        }
    }
});
//# sourceMappingURL=utils.js.map