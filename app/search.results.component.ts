import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass} from 'angular2/common';

@Component({
    selector: 'search-results',
    template: `
        <div class="search-results-panel">
            <div class="results">
                test
                test
                test
            </div>
        </div>
    `,
    directives: [NgClass],
    styles: [`
        .search-results-panel {
            position: absolute;
            display: block;
            top: 18px;
            left: 8px;
            padding: 36px 0 0 0;
            height: 300px;
            width: 500px;
            background-color: white;
            z-index: 900;
            display: flex;
            box-shadow: 0 5px 5px -3px rgba(0,0,0,.14),
                0 8px 10px 1px rgba(0,0,0,.098),
                0 3px 14px 2px rgba(0,0,0,.084);
        }
        
        .results {
            width: 100%;
            padding: 8px;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchResults {
    @Input() results: string[];
    
}