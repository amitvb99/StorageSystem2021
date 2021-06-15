import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(private http:HttpClient, private crud: CrudService) { }

  pushFileToStorage(file: File, api_url): Observable<any>{
    const formdata: FormData = new FormData();
 
    formdata.append('file', file);
    let headers = this.crud.get_headers()
    const req = new HttpRequest('POST', api_url, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }
 
  
}
