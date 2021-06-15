import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-fix-page',
  templateUrl: './fix-page.component.html',
  styleUrls: ['./fix-page.component.css']
})
export class FixPageComponent implements OnInit {

  id: string = '0'
  fix: string;
  maintainer: any = {};
  instrument: any = {};
  openning_user: any = {};
  closing_user: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private crud: CrudService) { }
  export() {
    alert('exporting')
    let url = `${environment.apiUrl}/api/user/imports/fixes/${this.id}`
    let headers = this.crud.get_headers()
    headers['responseType'] = "blob"
    this.http.get(url, headers)
              .toPromise()
              .then(blob => {
                  saveAs(blob, `loan_${this.id}.csv`); 
              })
              .catch(err => console.error("download error = ", err))
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('fixes', this.id).subscribe(res => {
        console.log(res)
        this.fix = res
        this.maintainer = res['maintainer']
        this.instrument = res['instrument']
        this.openning_user = res['openUser']
        this.closing_user = res['closeUser']
        
      })
    })
  }

}
