import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-maintainer-page',
  templateUrl: './maintainer-page.component.html',
  styleUrls: ['./maintainer-page.component.css']
})
export class MaintainerPageComponent implements OnInit {


    export() {
      alert('exporting')
      let url = `${environment.apiUrl}/api/user/imports/maintainers/${this.id}`
      this.http.get(url, {responseType: "blob"})
                .toPromise()
                .then(blob => {
                    saveAs(blob, `student_${this.id}.csv`); 
                })
                .catch(err => console.error("download error = ", err))
    }
  

  constructor(private http: HttpClient, private route: ActivatedRoute, private crud: CrudService, private router: Router) { }
    id:string;
    maintainer:any = {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('maintainers', this.id).subscribe(
        res => {
          this.maintainer = res['maintainer'];

        }
      )
    })
  }

}
