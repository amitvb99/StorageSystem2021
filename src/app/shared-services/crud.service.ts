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

  fix_loan(loan){
    console.log("loan is\n")
    console.log(loan)
    loan.student_name = loan['student']['fName']
    loan.student_school = loan['student']['school']
    loan.student_class = loan['student']['class']
    loan.student_class = loan['student']['class']
    loan.openning_user = loan['openUser']['name']
    loan.instrument = loan['instrument']['generalSerialNumber']


    if (loan['closeUser'] != undefined)
       loan.closing_user = loan['closeUser']['name']
    else {
      loan.closing_user = ''
    }

    if (loan.closing_user == '') loan.closing_user = 'X'
    if (loan.to == '') loan.to = 'X'
    if (loan.notes == '') loan.notes = 'X'  
  }
  read(component:string,id:string = '',query_string:string = ''){
    const path = this.get_path(component,query_string,id)
    var res = this.http.get(path, this.get_headers()).pipe(
      map(res => {
        console.log('crud service: read:')
        console.log(res)
        if (component == 'loans' && id == ''){
          for (var idx in res['data']) {
            this.fix_loan(res['data'][idx])            
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
            this.fix_loan(res['data'][idx]) 
          }
        }
        return res['data'];
        
  }))
    return res
  }

  loan_instrument(loan){
    var path = `${environment.apiUrl}/api/user/loans/loanInstrument`
    console.log(`loan instrument: ${path}`)
    

    var res = this.http.post(path, loan, this.get_headers()).pipe(
      map(res => {
        const loan_id =  res['data'];
        path = `${environment.apiUrl}/api/user/loans/${loan_id}`
        return this.http.get(path, this.get_headers()).pipe(map(
          res => {
            return res["data"]
          }
      ))
  }))
    return res
  }

  fix_instrument(loan){
    var path = `${environment.apiUrl}/api/user/maintainers/fix`
    console.log(`loan instrument: ${path}`)
    

    var res = this.http.post(path, loan, this.get_headers()).pipe(
      map(res => {
        const loan_id =  res['data'];
        path = `${environment.apiUrl}/api/user/maintainers/${loan_id}`
        return this.http.get(path, this.get_headers()).pipe(map(
          res => {
            return res["data"]
          }
      ))
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


  promote_user(user_id){
    const path = `${environment.apiUrl}/api/user/manage/promoteUser/${user_id}`
    const observer = this.http.post(path, {}, this.get_headers()).pipe(
      map(res => {
        console.log(res)
        return res
      })
    )
    return observer
  }
  
  demote_user(user_id){
    const path = `${environment.apiUrl}/api/user/manage/demoteAdmin/${user_id}`
    const observer = this.http.post(path, {}, this.get_headers()).pipe(
      map(res => {
        console.log(res)
      })
    )
    return observer
  }


}
