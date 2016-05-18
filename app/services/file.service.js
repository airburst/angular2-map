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
var FileService = (function () {
    function FileService() {
        this.options = {
            'types': ['txt']
        };
    }
    FileService.prototype.readTextFile = function (input, response) {
        var file = input.files[0], name = file.name, ext = this.extension(name), reader = new FileReader();
        reader.onloadend = function () {
            response(reader.result, name, ext);
        };
        reader.readAsText(file);
    };
    FileService.prototype.extension = function (fileName) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(fileName)[1];
        if (ext !== undefined) {
            return ext;
        }
        return '';
    };
    FileService.prototype.supports = function (input) {
        // Check whether cancel button pressed
        if (input.files.length === 0) {
            return false;
        }
        // Check whether file extension is in our whitelist
        var ext = this.extension(input.files[0].name);
        if (this.options.types.indexOf(ext) > -1) {
            return true;
        }
        return false;
    };
    FileService.prototype.setAllowedExtensions = function (extensions) {
        this.options.types = extensions;
    };
    FileService.prototype.save = function (text, filename) {
        var textFileAsBlob = new Blob([text], { type: 'text/plain' }), downloadLink = document.createElement('a');
        if (filename === ".gpx") {
            filename = "route.gpx";
        }
        downloadLink.download = filename;
        downloadLink.innerHTML = 'Download File';
        if (window.URL !== null) {
            // Chrome allows the link to be clicked without actually adding it to the DOM
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        }
        else {
            // Firefox requires the link to be added to the DOM before it can be clicked
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    };
    FileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], FileService);
    return FileService;
}());
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map