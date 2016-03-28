export const uuid = () => {
    return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/1|0/g, function() {
            return (0 | Math.random() * 16).toString(16);
        });
};

export const chunk = (collection, chunkSize) => {
    let i, chunked = [];
    if (!collection || isNaN(parseInt(chunkSize, 10))) {
        return [];
    }
    for (i = 0; i < collection.length; i += chunkSize) {
        chunked.push(collection.slice(i, i + chunkSize));
    };
    return chunked;
};

export const flatten = (array: Array<any>): Array<any> => {
    return [].concat.apply([], array);
};

export const elevationData = (array: Array<any>): Array<any> => {
    return array.map((point) => {
        return point.elevation;
    });
};
