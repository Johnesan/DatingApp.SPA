import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '../../../node_modules/@angular/http';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { User } from '../_models/User';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;

    constructor(private http: Http) { }

    getUsers(): Observable<User[]> {
        return this.http.get(this.baseUrl + 'users', this.jwt())
        .map(response => <User[]>response.json())
        .catch(this.handleError);
    }

    getUser(id): Observable<User> {
        return this.http.get(this.baseUrl + 'users/' + id, this.jwt())
        .map(response => <User>response.json())
        .catch(this.handleError);
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + 'users/' + id, user, this.jwt()).catch(this.handleError);
    }

    setMainPhoto(userId: number, id: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {}, this.jwt()).catch(this.handleError);
    }

    deletePhoto(userId: number, id: number) {
        return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id, this.jwt()).catch(this.handleError);
    }

    private jwt() {
        const token = localStorage.getItem('token');
        if (token) {
            const headers = new Headers({'Authorization': 'Bearer ' + token});
            headers.append('Content-type', 'application/json');
            return new RequestOptions({headers: headers});
        }
    }

    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }

        const serverError = error.json();
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(
            modelStateErrors || 'Server error'
        );
    }
}
