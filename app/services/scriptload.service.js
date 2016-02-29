System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ScriptLoadService;
    return {
        setters:[],
        execute: function() {
            ScriptLoadService = (function () {
                function ScriptLoadService() {
                }
                ScriptLoadService.prototype.load = function (url) {
                    var scriptPromise = new Promise(function (resolve, reject) {
                        // Create a new script tag
                        var script = document.createElement('script');
                        // Use the url argument as source attribute
                        script.src = url;
                        script.async = true;
                        // Call resolve when it’s loaded
                        script.addEventListener('load', function () {
                            resolve(url);
                        }, false);
                        // Reject the promise if there’s an error
                        script.addEventListener('error', function () {
                            reject(url);
                        }, false);
                        // Add it to the body
                        document.body.appendChild(script);
                    });
                    return scriptPromise;
                };
                return ScriptLoadService;
            }());
            exports_1("ScriptLoadService", ScriptLoadService);
        }
    }
});
//# sourceMappingURL=scriptload.service.js.map