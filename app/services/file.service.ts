import {Injectable} from '@angular/core';

@Injectable()
export class FileService {
    
    private options = {
        'types': ['txt']
    };
    
    readTextFile(input: any, response: Function): void {
        let file: File = input.files[0],
            name: string = file.name,
            ext: string = this.extension(name),
            reader: FileReader = new FileReader();

        reader.onloadend = function() {
            response(reader.result, name, ext);
        }
        
        reader.readAsText(file);
    }
    
    extension(fileName: string): string {
        let re = /(?:\.([^.]+))?$/;
        let ext = re.exec(fileName)[1];
        if(ext !== undefined) { return ext; }
        return '';
    }
    
    supports(input: any): boolean {
        // Check whether cancel button pressed
        if (input.files.length === 0) { return false; }
        
        // Check whether file extension is in our whitelist
        let ext = this.extension(input.files[0].name);
        if (this.options.types.indexOf(ext) > -1) { return true; }
        return false;
    }
    
    setAllowedExtensions(extensions: string[]): void {
        this.options.types = extensions;
    }
    
    save(text: string, filename: string) {
        let textFileAsBlob = new Blob([text], {type: 'text/plain'}),
            downloadLink = document.createElement('a');
            
        if (filename === ".gpx") { filename = "route.gpx"; }
        downloadLink.download = filename;
        downloadLink.innerHTML = 'Download File';

        if (window.URL !== null) {
            // Chrome allows the link to be clicked without actually adding it to the DOM
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        } else {
            // Firefox requires the link to be added to the DOM before it can be clicked
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
    }
    
}
