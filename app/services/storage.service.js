"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var route_1 = require('../models/route');
var StorageService = (function () {
    function StorageService(http) {
        this.http = http;
        //private baseUrl: string = 'http://localhost:3000/route/';
        this.baseUrl = 'http://mapsapi.fairhursts.net/route/';
    }
    StorageService.prototype.getRoute = function (id) {
        return this.http.get(this.baseUrl + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    StorageService.prototype.saveRoute = function (route) {
        var body = JSON.stringify({ route: route });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(this.baseUrl, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    StorageService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        if (body.length === 0) {
            return { details: { name: 'false' } };
        }
        var data = (body[0]) ? body[0] : body, route = new route_1.Route(data.route);
        route.id = data.id;
        return route;
    };
    StorageService.prototype.handleError = function (error) {
        // In a real world app, we might send the error to remote logging infrastructure
        var errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    StorageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], StorageService);
    return StorageService;
}());
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map