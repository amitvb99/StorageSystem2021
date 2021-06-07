import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-loan-page',
  templateUrl: './loan-page.component.html',
  styleUrls: ['./loan-page.component.css']
})
export class LoanPageComponent implements OnInit {
  id: string = '0'
  loan: string;
  student: any;
  instrument: any;
  openning_user: any;
  closing_user: any;
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private crud: CrudService) { }

  export() {
    alert('exporting')
    let url = `${environment.apiUrl}/api/user/imports/loans/:${this.id}`
    this.http.get(url, {responseType: "blob"})
              .toPromise()
              .then(blob => {
                  saveAs(blob, `loan_${this.id}.gz`); 
              })
              .catch(err => console.error("download error = ", err))
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('loans', this.id).subscribe(res => {
        console.log(res)
        this.loan = res
        this.student = res['student']
        this.instrument = res['instrument']
        this.openning_user = res['openUser']
        this.closing_user = res['closeUser']
      })
    })
  }

}
