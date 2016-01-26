export let settings: any = {
    url: 'http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js',
    key: 'A73F02BD5E3B3B3AE0405F0AC8602805',
    osMapUrl(): string {
        return this.url + '?key=' + this.key;
    },
    gMapUrl: 'http://maps.googleapis.com/maps/api/js?v=3.exp'
}