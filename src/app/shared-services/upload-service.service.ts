import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(private http:HttpClient) { }

  pushFileToStorage(file: File, api_url): Observable<any>{
    const formdata: FormData = new FormData();
 
    formdata.append('file', file);
 
    const req = new HttpRequest('POST', api_url, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }
 
  getFiles(): Observable<any> {
    return this.http.get('/getallfiles');
  }
  
}