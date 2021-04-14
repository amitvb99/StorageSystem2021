import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http:HttpClient) { }



 private get_headers(){
  const headerDict = {
    'Accept': 'application/json, text/plain, */*',
    'authorization': localStorage.getItem('token'),
    'user_id': localStorage.getItem('user_id')
  }
  
  const requestOptions = {                                                                                                                                                                                 
    headers: headerDict, 
  };
  return requestOptions
 }

 /**
 * 
 * component:string the component we are trying to make CRUD operation for
 * e.g.: loans, students, ...
 */
  private get_path(component:string,query_string:string, extension:string){
    var qs = ''
    var ex = ''
    if  (query_string != '') {
      qs = `/?${query_string}`
    }
    if  (extension != '') {
      ex = `/${extension}`
    }
    
    const path = `${environment.apiUrl}/api/user/${component}${ex}${qs}`
    return path
  }
  create(component:string, object_to_create, query_string:string = ''){
    const path = this.get_path(component,query_string,'create')
    var res = this.http.post(path,object_to_create, this.get_headers()).pipe(map(res => {
      console.log('crud service: create:')
      console.log(res)
      return res;
    }))
    return res
  }

  delete(component:string, id:string, query_string:string = ''){
    const path = this.get_path(component, query_string,id)
    var res = this.http.delete(path, this.get_headers()).pipe(map(res => {
      console.log('crud service: delete:')
      console.log(res)
      return res;
    }))
    return res
  }

  update(component:string, object_to_update, id:string, query_string:string = ''){
    const path = this.get_path(component,query_string,id)
    var res = this.http.put(path,object_to_update, this.get_headers()).pipe(map(res => {
      console.log('crud service: update:')
      console.log(res)
      return res;
    }))
    return res
  }

  read(component:string,id:string = '',query_string:string = ''){
    const path = this.get_path(component,query_string,id)
    var res = this.http.get(path, this.get_headers()).pipe(
      map(res => {
        console.log('crud service: read:')
        console.log(res)
        if (component == 'loans'){
          for (var idx in res['data']) {
            res['data'][idx].student_name = res['data'][idx]['student']['fName']
            res['data'][idx].student_school = res['data'][idx]['student']['school']
            res['data'][idx].student_class = res['data'][idx]['student']['class']
            res['data'][idx].student_class = res['data'][idx]['student']['class']
            res['data'][idx].openning_user = res['data'][idx]['openUser']['name']
            res['data'][idx].instrument = res['data'][idx]['instrument']['generalSerialNumber']


            if (res['data'][idx]['closeUser'] != undefined)
               res['data'][idx].closing_user = res['data'][idx]['closeUser']['name']
            else {
              res['data'][idx].closing_user = ''
            }

            if (res['data'][idx].closing_user == '') res['data'][idx].closing_user = 'X'
            if (res['data'][idx].to == '') res['data'][idx].to = 'X'
            if (res['data'][idx].notes == '') res['data'][idx].notes = 'X'            
          }
        }
        return res['data'];
        
  }))
    return res
  }

  filtered_read(component:string, filter_string:string, query_string:string = ''){
    const path = this.get_path(component,'',`filter/${filter_string}`)

    var res = this.http.get(path, this.get_headers()).pipe(
      map(res => {
        console.log('crud service: filtered_read:')
        if (component == 'loans'){
          for (var idx in res['data']) {
            res['data'][idx].student_name = res['data'][idx]['student']['fName']
            res['data'][idx].student_school = res['data'][idx]['student']['school']
            res['data'][idx].student_class = res['data'][idx]['student']['class']
            res['data'][idx].student_class = res['data'][idx]['student']['class']
            res['data'][idx].openning_user = res['data'][idx]['openUser']['name']
            res['data'][idx].instrument = res['data'][idx]['instrument']['generalSerialNumber']


            if (res['data'][idx]['closeUser'] != undefined)
               res['data'][idx].closing_user = res['data'][idx]['closeUser']['name']
            else {
              res['data'][idx].closing_user = ''
            }

            if (res['data'][idx].closing_user == '') res['data'][idx].closing_user = 'X'
            if (res['data'][idx].to == '') res['data'][idx].to = 'X'
            if (res['data'][idx].notes == '') res['data'][idx].notes = 'X'            
          }
        }
        return res['data'];
        
  }))
    return res
  }

  loan_instrument(loan){
    const path = `${environment.apiUrl}/api/user/loans/loanInstrument`
    console.log(`loan instrument: ${path}`)
    

    var res = this.http.post(path, loan, this.get_headers()).pipe(
      map(res => {
        return res['data'];
  }))
    return res
  }

  end_loan(loan_id){
    const path = `${environment.apiUrl}/api/user/loans/endLoan/${loan_id}`
    console.log(`ending loan: ${path}`)
    var res = this.http.post(path, {}, this.get_headers()).pipe(
      map(res => {
        console.log(res)
        return res['data'];
  }))
    return res
  }


}
