import {Injectable} from 'angular2/core';

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
    
}
