"use strict";
var ScriptLoadService = (function () {
    function ScriptLoadService() {
    }
    ScriptLoadService.prototype.load = function (url) {
        var scriptPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
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
            document.body.appendChild(script);
        });
        return scriptPromise;
    };
    return ScriptLoadService;
}());
exports.ScriptLoadService = ScriptLoadService;
//# sourceMappingURL=scriptload.service.js.map