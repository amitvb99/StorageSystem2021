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
    'authorization': localStorage.getItem('token')
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
    var res = this.http.post(path,object_to_create, this.get_headers())
    return res
  }

  delete(component:string, id:string, query_string:string = ''){
    const path = this.get_path(component, query_string,id)
    var res = this.http.delete(path, this.get_headers())
    return res
  }

  update(component:string, object_to_update, id:string, query_string:string = ''){
    const path = this.get_path(component,query_string,id)
    var res = this.http.put(path,object_to_update, this.get_headers())
    return res
  }

  read(component:string,id:string = '',query_string:string = ''){
    const path = this.get_path(component,query_string,id)
    var res = this.http.get(path, this.get_headers()).pipe(
      map(res => {
      return res[component];
  }))
    return res
  }
}
