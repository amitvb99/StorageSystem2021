import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../app-interfaes';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http:HttpClient) { 
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
  }
  private userSubject: BehaviorSubject<User>;
    login(user,path){//user should be json object
      
    return this.http.post<User>(`${environment.apiUrl}${path}`, user)
    .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
    }));
  }
  get_user_firs_name(){
    if (this.isloggedin()){
      console.log(localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName;
    } else {
      return 'Guest';
    }
  }
  isloggedin(){
    return localStorage.getItem('user') !== 'null'
  }
  logout(){
    var path = '/api/logout'
    if (this.isloggedin()){
      
      return this.http.post<User>(`${environment.apiUrl}${path}`, JSON.parse(localStorage.getItem('user'))).subscribe(val =>{
        this.userSubject.next(null)
        localStorage.setItem('user', null);
        return null;
      })
    }
    // this.http.post().
  }

  register(user){

    // this.http.post().
  }
}
