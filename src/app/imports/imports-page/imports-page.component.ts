import { Component, OnInit } from '@angular/core';
import { UploadServiceService } from 'src/app/shared-services/upload-service.service';
import { environment } from 'src/environments/environment';
import { HttpResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-imports-page',
  templateUrl: './imports-page.component.html',
  styleUrls: ['./imports-page.component.css']
})
export class ImportsPageComponent implements OnInit {

  api_to_post = ''
  maintainers = `${environment.apiUrl}/api/user/imports/maintainers`
  instruments = `${environment.apiUrl}/api/user/imports/instruments`
  students = `${environment.apiUrl}/api/user/imports/students`

  constructor(private uploadService:UploadServiceService) { }

  ngOnInit(): void {
  }

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.progress.percentage = 0;
  }
 
  upload() {
    this.progress.percentage = 0;

    if (this.api_to_post == '') {
      alert('please specify the data you are uploading')
      return;
    }

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.api_to_post).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log(event)
      }
    });
 
    this.selectedFiles = undefined;
    this.api_to_post = ''
  }
}
