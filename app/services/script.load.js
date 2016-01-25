System.register([], function(exports_1) {
    var ScriptLoader;
    return {
        setters:[],
        execute: function() {
            ScriptLoader = (function () {
                function ScriptLoader() {
                }
                ScriptLoader.prototype.load = function (url, success, failure) {
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
                return ScriptLoader;
            })();
            exports_1("ScriptLoader", ScriptLoader);
        }
    }
});
//# sourceMappingURL=script.load.js.map