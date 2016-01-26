export let settings: any = {
    url: 'http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js',
    key: 'A73F02BD5E3B3B3AE0405F0AC8602805',
    osMapUrl(): string {
        return this.url + '?key=' + this.key;
    }
}