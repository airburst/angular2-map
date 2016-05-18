"use strict";
exports.uuid = function () {
    return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/1|0/g, function () {
        return (0 | Math.random() * 16).toString(16);
    });
};
exports.replaceAll = function (find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
};
exports.chunk = function (collection, chunkSize) {
    var i, chunked = [];
    if (!collection || isNaN(parseInt(chunkSize, 10))) {
        return [];
    }
    for (i = 0; i < collection.length; i += chunkSize) {
        chunked.push(collection.slice(i, i + chunkSize));
    }
    ;
    return chunked;
};
exports.flatten = function (array) {
    return [].concat.apply([], array);
};
exports.elevationData = function (array) {
    return array.map(function (point) {
        return point.elevation;
    });
};
//# sourceMappingURL=utils.js.map