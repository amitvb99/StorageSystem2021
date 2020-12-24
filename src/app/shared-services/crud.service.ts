import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http:HttpClient) { }

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
    console.log(path)
    var res = this.http.post(path,object_to_create)
    return res
  }

  delete(component:string, id:string, query_string:string = ''){
    const path = this.get_path(component, query_string,id)
    console.log(path)
    var res = this.http.delete(path)
    return res
  }

  update(component:string, object_to_update, id:string, query_string:string = ''){
    const path = this.get_path(component,query_string,id)
    console.log(object_to_update)
    console.log(path)
    var res = this.http.put(path,object_to_update)
    return res
  }

  read(component:string,id:string = '',query_string:string = ''){
    const path = this.get_path(component,query_string,id)
    console.log(path)
    var res = this.http.get(path).pipe(
      map(res => {
      return res[component];
  }))
    console.log(res)
    return res
  }
}
