import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface user_t{
    name?: string,
    user: string,
    pass: string
}

export interface student_t { 
    fName: string,
    lName: string,
    school: string,
    grade: string,
    class: string,
    id: string,
    parent1Name: string,
    parent2Name: string,
    parent1PhoneNumber: string,
    parent2PhoneNumber: string,
    parent1Email: string,
    parent2Email: string,
    instruments: string
}


export interface instrument_t{
    id: string
    generalSerialNumber: string,
    type: string,
    sub_type: string,
    company: string,
    style: string,
    imprentedSerialNumber: string,
    ownership: string,
    status: string
}

export interface loan_t{
  student_id: string,
  instrument_id: string,
  user_id: string,
  notes: string
}

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  constructor(private http:HttpClient) { }

  private get_headers(){
      const headerDict = {
        'Accept': 'application/json, text/plain, */*',
        'authorization': localStorage.getItem('token')
      }

      const requestOptions = {                                                                                                                                                                                 
        headers: headerDict, 
      };

      return requestOptions
   }

  private my_get(path: string){
    return this.http.get(path, this.get_headers())
  }
  private my_post(path: string, obj: any){
    return this.http.post(path, obj, this.get_headers())
  }
/**
 * 
 *   register_user(user: user_t){}
 *   login(user: user_t){}
 *   get_users(){}  
 *   delete_user(user:user_t){}
 * 
 *   get_students(){
 *   add_student(s: student_t){}
 *   delete_student(student_id: number){}
 *   update_students(s: student_t){}
 * 
 *   get_instruments(){
 *   add_instrument(i: instrument_t){}
 *   delete_instrument(instrument_id: number){}
 *   update_instrument(i: instrument_t){}
 * 
 *   get_loans(){}
 *   add_loan(l: loan_t){}
 *   delete_loan(loan_id: number){}// ?
 *   update_loan(l: loan_t){}// ?
 */
  register_user(user: user_t){
    var done = false
    var data = undefined
    this.my_post(`${environment.apiUrl}/api/user/register`, user).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  login(username: string, password: string){
    let res = async (data, continuation, next_step_idx) => {
      
      const usr = {username: username, password: password}
      var promise = this.my_post(`${environment.apiUrl}/api/user/login`, usr).toPromise()
      await promise;
      promise.then((d)=> {
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1)
      })
    }
    return res
}
  get_users(){
    var done = false
    var data = undefined
    this.my_get(`${environment.apiUrl}/api/user/users`).pipe(map(res => {
      return res['students'];
    })).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }  
  delete_user(user_id){
    var done = false
    var data = undefined
    this.http.delete(`${environment.apiUrl}/api/user/${user_id}`, this.get_headers()).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }

  get_students(){
      var done = false
      var data = undefined
      this.my_get(`${environment.apiUrl}/api/students`).pipe(map(res => {
        return res['students'];
      })).subscribe((d) => {
        data = d
        done = true
      })
      while (!done);
      return data
  }

  add_student(s: student_t){
    var done = false
    var data = undefined
    this.my_post(`${environment.apiUrl}/api/user/students/create`, s).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  delete_student(student_id: number){
    var done = false
    var data = undefined
    this.http.delete(`${environment.apiUrl}/api/user/students/${student_id}`, this.get_headers()).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  update_students(s: student_t){
    var done = false
    var data = undefined
    this.http.put(`${environment.apiUrl}/api/user/students/${s.id}`, s,this.get_headers()).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  
  get_instruments(){
    var done = false
    var data = undefined
    this.my_get(`${environment.apiUrl}/api/instruments`).pipe(map(res => {
      return res['instruments'];
    })).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  add_instrument(i: instrument_t){
    var done = false
    var data = undefined
    this.my_post(`${environment.apiUrl}/api/user/instruments/create`, i).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  delete_instrument(instrument_id: number){
    var done = false
    var data = undefined
    this.http.delete(`${environment.apiUrl}/api/user/instruments/${instrument_id}`, this.get_headers()).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  update_instrument(i: instrument_t){
    var done = false
    var data = undefined
    this.http.put(`${environment.apiUrl}/api/user/instruments/${i.id}`, i,this.get_headers()).subscribe((d) => {
      data = d
      done = true
    })
    while (!done);
    return data
  }
  
  get_loans(){}
  add_loan(l: loan_t){}
  delete_loan(loan_id: number){}// ?
  update_loan(l: loan_t){}// ?
}
