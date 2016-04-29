import {Component, EventEmitter, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass} from 'angular2/common';

@Component({
    selector: 'search-results',
    inputs: ['results'],
    template: `
        <div *ngIf="results.length" class="search-results-panel">
            <div class="results">
                <ul class="results-list">
                    <li class="results-item" *ngFor="let result of results; let i=index" 
                        (click)="resultClicked(i)">
                        {{result.name}}, {{result.county}}  {{result.type}}
                    </li>
                </ul>
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
            overflow-y: scroll;
        }

        .results-list {
            width: 100%;
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .results-item {
            padding: 20px 16px;
            font-family: 'Roboto';
            border-bottom: 1px solid #e2e2e2;
        }
        .results-item:hover {
            background-color: #e2e2e2;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchResults {
    @Input() results: any[];
    @Output() selected = new EventEmitter();
    
    resultClicked(item) {
        let point = this.results[item].location;
        this.selected.emit({location: point})
    }
}