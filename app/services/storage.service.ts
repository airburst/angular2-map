import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Route, AppStore} from '../models/route';
import {initialState} from '../reducers/details';

@Injectable()
export class StorageService {

    //private baseUrl: string = 'http://localhost:3000/route/';
    private baseUrl: string = 'http://mapsapi.fairhursts.net/route/';

    constructor(private http: Http) { }

    getRoute(id: string): Observable<any> {
        return this.http.get(this.baseUrl + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveRoute(route: Route): Observable<Route> {
        let body = JSON.stringify({ route });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.baseUrl, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        if (body.length === 0) {
            return { details: { name: 'false' } };
        }
        let data = (body[0]) ? body[0] : body,
            route = new Route(data.route);
        route.id = data.id;
        return route;
    }

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}