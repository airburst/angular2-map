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
var common_1 = require('@angular/common');
var SearchResults = (function () {
    function SearchResults() {
        this.selected = new core_1.EventEmitter();
        this.closed = new core_1.EventEmitter();
    }
    SearchResults.prototype.resultClicked = function (item) {
        var point = this.results[item].location;
        this.selected.emit({ location: point });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SearchResults.prototype, "results", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SearchResults.prototype, "selected", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SearchResults.prototype, "closed", void 0);
    SearchResults = __decorate([
        core_1.Component({
            selector: 'search-results',
            inputs: ['results'],
            template: "\n        <div *ngIf=\"results.length\" class=\"search-results-panel\">\n            <div class=\"results\">\n                <ul class=\"results-list\">\n                    <li class=\"results-item\" *ngFor=\"let result of results; let i=index\" \n                        (click)=\"resultClicked(i)\">\n                        {{result.name}}, {{result.county}}  {{result.type}}\n                    </li>\n                </ul>\n            </div>\n            <div class=\"close-button\">\n                <button class=\"btn btn-close\" (click)=\"closed.emit()\">CLOSE</button>\n            </div>\n        </div>\n    ",
            directives: [common_1.NgClass],
            styles: ["\n        .search-results-panel {\n            position: absolute;\n            top: 18px;\n            left: 8px;\n            padding: 36px 0 0 0;\n            width: 500px;\n            background-color: white;\n            z-index: 900;\n            display: flex;\n            flex-direction: column;\n            box-shadow: 0 5px 5px -3px rgba(0,0,0,.14),\n                0 8px 10px 1px rgba(0,0,0,.098),\n                0 3px 14px 2px rgba(0,0,0,.084);\n        }\n        \n        .results {\n            width: 100%;\n            overflow-y: scroll;\n            max-height: 300px;\n            display: flex;\n        }\n\n        .results-list {\n            width: 100%;\n            list-style-type: none;\n            padding: 0;\n            margin: 0;\n        }\n\n        .results-item {\n            padding: 16px;\n            font-family: 'Roboto', 'Arial', 'Helvetica';\n            border-bottom: 1px solid #e2e2e2;\n            cursor: pointer;\n        }\n        .results-item:hover {\n            background-color: #e2e2e2;\n        }\n\n        .close-button {\n            display: -webkit-flex;\n            display: flex;\n            -webkit-flex-direction: row;\n            flex-direction: row;\n            /*-webkit-justify-content: flex-end;\n            justify-content: flex-end;*/\n        }\n        \n        .btn-close {\n            background-color: #00897B;\n            color: white;\n            border: 0px;\n            margin: 8px 16px;\n            padding: 8px 20px;\n            font-family: 'Roboto', 'Arial', 'Helvetica';\n            cursor: pointer;\n        }\n    "],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], SearchResults);
    return SearchResults;
}());
exports.SearchResults = SearchResults;
//# sourceMappingURL=search.results.component.js.map