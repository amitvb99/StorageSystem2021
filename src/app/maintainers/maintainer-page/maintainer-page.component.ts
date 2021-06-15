import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';

@Component({
  selector: 'app-maintainer-page',
  templateUrl: './maintainer-page.component.html',
  styleUrls: ['./maintainer-page.component.css']
})
export class MaintainerPageComponent implements OnInit {

    maintain(){
        this.router.navigate(['/maintainence'], { queryParams: { maintainer_id: this.id } });
    }

    edit(){
        const config = new MatDialogConfig()
        config.autoFocus = true
        let dialog_ref = this.dialog.open(GenericFormComponent,config)
        let instance = dialog_ref.componentInstance;
        instance.meta_data =  this.form_meta_data;
        instance.data = this.maintainer
        instance.is_add =  false;
        dialog_ref.afterClosed().subscribe(dialog_res => {
        this.crud.update("maintainers",dialog_res,this.id).subscribe(res =>{
            if (res !== null){
            for (let key in dialog_res) {
                //update ui
                this.maintainer[key] = dialog_res[key];
            }
            } else {
            // output error
            }
        }
        )
        });
    
  }

    delete(){
        this.crud.delete("maintainers",this.id).subscribe(res => {
            this.router.navigate(['/maintainers']);
        })
        }

    export() {
      alert('exporting')
      let url = `${environment.apiUrl}/api/user/imports/maintainers/${this.id}`
      let headers = this.crud.get_headers()
      headers['responseType'] = "blob"
      this.http.get(url, headers)
                .toPromise()
                .then(blob => {
                    saveAs(blob, `student_${this.id}.csv`); 
                })
                .catch(err => console.error("download error = ", err))
    }
  

  constructor(private dialog: MatDialog,private http: HttpClient, private route: ActivatedRoute, private crud: CrudService, private router: Router) { }
    id:string;
    maintainer:any = {}

    form_meta_data : generic_form_meta_data_t = [
        { 
          name:'Maintainer Info',
          fields:[
            {
              id: 'maintainerName',
              name:'Name',
              type:'text',
              can_edit:true
            },
            {
              id: 'maintainerPhone',
              name:'Phone Number',
              type:'text',
              can_edit:true
            },
            {
              id: 'maintainerAddress',
              name:'Address',
              type:'text',
              can_edit:true
            }
          ]
        }
      ]
      
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
