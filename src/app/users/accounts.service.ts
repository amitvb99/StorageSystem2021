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
      console.log(user)

      return this.http.post(`${environment.apiUrl}${path}`, user)
      .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.log(user)
          localStorage.setItem('user', JSON.stringify(user['data']));
          localStorage.setItem('permission', 'admin');
          localStorage.setItem('token', user['data']['token']);
          localStorage.setItem('user_id', user['data']['id']);
          return user;
      }));
    }
    get_user_firs_name(){
      if (this.isloggedin()){
        return JSON.parse(localStorage.getItem('user')).name;
      } else {
        return 'Guest';
      }
    }

    get_user_id(){
      if (this.isloggedin()){
        return localStorage.getItem('user_id');
      } else {
        return '';
      }
    }
  isloggedin(){
    return localStorage.getItem('user') !== 'null'
  }
  logout(){
    localStorage.setItem('user', null);
    localStorage.setItem('permission', null);
    localStorage.setItem('token', null);
    // this.http.post().
  }

  register(user){
    console.log(user)

    return this.http.post(`${environment.apiUrl}/api/user/register`, user)
    .pipe(map(user => {
        return user;
    }));
  }

  delete_user(user_id){
    return this.http.delete(`${environment.apiUrl}/api/user/${user_id}`)
    .pipe(map(user => {
        return user;
    }));
  }
}
