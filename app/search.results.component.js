System.register(['angular2/core', 'angular2/common'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1;
    var SearchResults;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            SearchResults = (function () {
                function SearchResults() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], SearchResults.prototype, "results", void 0);
                SearchResults = __decorate([
                    core_1.Component({
                        selector: 'search-results',
                        template: "\n        <div class=\"search-results-panel\">\n            <div class=\"results\">\n                test\n                test\n                test\n            </div>\n        </div>\n    ",
                        directives: [common_1.NgClass],
                        styles: ["\n        .search-results-panel {\n            position: absolute;\n            display: block;\n            top: 18px;\n            left: 8px;\n            padding: 36px 0 0 0;\n            height: 300px;\n            width: 500px;\n            background-color: white;\n            z-index: 900;\n            display: flex;\n            box-shadow: 0 5px 5px -3px rgba(0,0,0,.14),\n                0 8px 10px 1px rgba(0,0,0,.098),\n                0 3px 14px 2px rgba(0,0,0,.084);\n        }\n        \n        .results {\n            width: 100%;\n            padding: 8px;\n        }\n    "],
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [])
                ], SearchResults);
                return SearchResults;
            }());
            exports_1("SearchResults", SearchResults);
        }
    }
});
//# sourceMappingURL=search.results.component.js.map