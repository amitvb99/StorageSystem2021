import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface user_t{
    id?: string,
    name: string,
    user: string,
    pass: string,
    privilidge: string
}

export interface student_t { 
    id?: string,
    fName: string,
    lName: string,
    school: string,
    grade: string,
    class: string,
    parent1Name: string,
    parent2Name: string,
    parent1PhoneNumber: string,
    parent2PhoneNumber: string,
    parent1Email: string,
    parent2Email: string,
    instruments: string
}

export interface instrument_t{
    id?: string
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
  id?: string
  student_id: string,
  instrument_id: string,
  user_id: string,
  notes: string,
  date?: string
}

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  constructor(private http:HttpClient, private router:Router) { }

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
 *   clear()
 *   login_admin()
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
 *   add_students()
 * 
 *   get_instruments(){
 *   add_instrument(i: instrument_t){}
 *   delete_instrument(instrument_id: number){}
 *   update_instrument(i: instrument_t){}
 *   add_instruments()
 * 
 *   get_loans(){}
 *   add_loan(l: loan_t){}
 *   delete_loan(loan_id: number){}// ?
 *   update_loan(l: loan_t){}// ?
 */

  login_admin(field_name: string = 'result'){
    let res = async (data, continuation, next_step_idx) => {
      
      const usr = {username: 'admin', password: 'admin'}
      var promise = this.my_post(`${environment.apiUrl}/api/user/login`, usr).toPromise()
      await promise;
      promise.then((d)=> {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1)
      })
    }
    return res
  }

  clear(field_name: string = 'result'){
    let res = async (data, continuation, next_step_idx) => {

      var promise = this.my_post(`${environment.apiUrl}/api/db/clear`, {}).toPromise()
      await promise;
      promise.then((d)=> {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1)
      })
    }
    return res
  }

  register_user(user: user_t, field_name: string = 'users'){
    let res = async (data, continuation, next_step_idx) => {
      
      var promise = this.my_post(`${environment.apiUrl}/api/user/register`, user).toPromise()
      await promise;
      promise.then((d)=> {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1)
      })
    }
    return res
  }

  login(username: string, password: string, field_name: string = 'result'){
    let res = async (data, continuation, next_step_idx) => {
      
      const usr = {username: username, password: password}
      var promise = this.my_post(`${environment.apiUrl}/api/user/login`, usr).toPromise()
      await promise;
      promise.then((d)=> {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1)
      })
    }
    return res
}
  get_users(field_name: string = 'users'){
    let res = async (data, continuation, next_step_idx) => {
      var promise = this.my_get(`${environment.apiUrl}/api/user/users`).pipe(map(res => {
        return res['students'];
      })).toPromise()
      await promise
      promise.then((d) => {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1)
      })
    }

    return res
  }  

  delete_user(user_id_field_name = 'id', field_name: string = 'result'){
    let res = async (data, continuation, next_step_idx) => {
      var promise = this.http.delete(`${environment.apiUrl}/api/user/${data[user_id_field_name]}`, this.get_headers()).toPromise()
      await promise
      promise.then((d) => {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
      })
    }

  return res
  }

  get_students(field_name: string = 'students'){
    let res = async (data, continuation, next_step_idx) => {
      var promise = this.my_get(`${environment.apiUrl}/api/students`).pipe(map(res => {
                      return res[field_name];
                    })).toPromise()
        await promise
        promise.then((d) => {
        data['students'] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
      })
    }

    return res
  }

  get_student_by_id(student_id_field_name = 'id',field_name: string = 'student'){
    let res = async (data, continuation, next_step_idx) => {
      var promise = this.my_get(`${environment.apiUrl}/api/students/${data[student_id_field_name]}`).pipe(map(res => {
                      return res['students'];
                    })).toPromise()
        await promise
        promise.then((d) => {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
      })
    }

    return res
  }

  add_student(s: student_t, field_name: string = 'student'){
    let res = async (data, continuation, next_step_idx) => {
      var promise = this.my_post(`${environment.apiUrl}/api/user/students/create`, s).toPromise()
      await
      promise.then((d) => {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
      })
    }

    return res

  }

  add_students(students: student_t[], field_name: string = 'ids'){
    let res = async (data, continuation, next_step_idx) => {
      for (let i in students){
        var promise = this.my_post(`${environment.apiUrl}/api/user/students/create`, students[i]).toPromise()
        await
        promise.then((d) => {
          if (+i == 0) {
            data[field_name] = [d]
          } else {
            data[field_name].push(d) 
          }
          if (+i == students.length - 1){
          continuation[next_step_idx-1].status = 2
          continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
          }
        })
      }
      
    }
  

    return res

  }

  delete_student(student_id_field_name = 'id', field_name: string = 'student'){
    let res = async (data, continuation, next_step_idx) => {

      var promise = this.http.delete(`${environment.apiUrl}/api/user/students/${data[student_id_field_name]}`, this.get_headers()).toPromise()
      await promise
      promise.then((d) => {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
      })
    }

    return res
  }
  update_student(s: student_t,student_id_filed_name = 'id' ,field_name: string = 'student'){
    let res = async (data, continuation, next_step_idx) => {

      this.http.put(`${environment.apiUrl}/api/user/students/${data[student_id_filed_name]}`, s,  this.get_headers()).subscribe((d) => {
        data[field_name] = d
        continuation[next_step_idx-1].status = 2
        continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
      },
      res => {
          if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
      })
    }

    return res
 
  }
  
get_instruments(field_name: string = 'instruments'){
  let res = async (data, continuation, next_step_idx) => {

    var promise = this.my_get(`${environment.apiUrl}/api/instruments`).pipe(map(res => {
      return res['instruments'];
    })).toPromise()
    
    promise.then((d) => {
      data[field_name] = d
      continuation[next_step_idx-1].status = 2
      continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
    })
  }

  return res
}

add_instrument(i: instrument_t, field_name: string = 'instrument'){
  let res = async (data, continuation, next_step_idx) => {

    var promise = this.my_post(`${environment.apiUrl}/api/user/instruments/create`, i).toPromise()
    promise.then((d) => {
      data[field_name] = d
      continuation[next_step_idx-1].status = 2
      continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
    })
  }

  return res
}


delete_instrument(instrument_id_fieldname = 'id', field_name: string = 'instrument'){
  let res = async (data, continuation, next_step_idx) => {

    var promise = this.http.delete(`${environment.apiUrl}/api/user/instruments/${data[instrument_id_fieldname]}`, this.get_headers()).toPromise()
    promise.then((d) => {
      data[field_name] = d
      continuation[next_step_idx-1].status = 2
      continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
    })
  }

  return res
}
update_instrument(i: instrument_t, instrument_id_fieldname = 'id', field_name: string = 'instrument'){
  let res = async (data, continuation, next_step_idx) => {
    var promise = this.http.put(`${environment.apiUrl}/api/user/instruments/${data[instrument_id_fieldname]}`, i,this.get_headers()).toPromise()
    
    promise.then((d) => {
      data[field_name] = d
      continuation[next_step_idx-1].status = 2
      continuation[next_step_idx].step(data, continuation, next_step_idx+1) 
    })
  }

  return res
}
  
  get_loans(field_name: string = 'loans'){}
  add_loan(l: loan_t, field_name: string = 'student'){}
  delete_loan(loan_id: number){}// ?
  update_loan(l: loan_t){}// ?

  pass(){
    let res = async (data, continuation, next_step_idx) => {
      data['pass']()
    }

    return res
  }
}
