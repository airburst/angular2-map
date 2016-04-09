System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var uuid, replaceAll, chunk, flatten, elevationData;
    return {
        setters:[],
        execute: function() {
            exports_1("uuid", uuid = function () {
                return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11)
                    .replace(/1|0/g, function () {
                    return (0 | Math.random() * 16).toString(16);
                });
            });
            exports_1("replaceAll", replaceAll = function (find, replace, str) {
                return str.replace(new RegExp(find, 'g'), replace);
            });
            exports_1("chunk", chunk = function (collection, chunkSize) {
                var i, chunked = [];
                if (!collection || isNaN(parseInt(chunkSize, 10))) {
                    return [];
                }
                for (i = 0; i < collection.length; i += chunkSize) {
                    chunked.push(collection.slice(i, i + chunkSize));
                }
                ;
                return chunked;
            });
            exports_1("flatten", flatten = function (array) {
                return [].concat.apply([], array);
            });
            exports_1("elevationData", elevationData = function (array) {
                return array.map(function (point) {
                    return point.elevation;
                });
            });
        }
    }
});
//# sourceMappingURL=utils.js.map