import {Injectable} from 'angular2/core';

@Injectable()
export class FileService {
    
    ReadTextFile(input: any, response: Function): void {
        let file: File = input.files[0]; 
        let reader: FileReader = new FileReader();
        
        // Return text file
        reader.onloadend = function() {
            response(reader.result);
        }

        reader.readAsText(file);
    }
    
}
