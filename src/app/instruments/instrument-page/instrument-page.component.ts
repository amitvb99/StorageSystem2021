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
  selector: 'app-instrument-page',
  templateUrl: './instrument-page.component.html',
  styleUrls: ['./instrument-page.component.css']
})
export class InstrumentPageComponent implements OnInit {
  id: string = '0'
  instrument = {}
  history = []
  history_table_metadata = {
    component_name: "instruments",
    indexing_enabled : true,
    add_button_enabled: false,
    discrete_filter_bar: false,
    free_text_filter_bar: false,
    export_button_enabled: false,
    columns_count:3,
    columns:['date', 'status', 'user'],
    headers:{
      'date':'Date',
      'status':'Status',
      'user':'User',
    }, 
    actions:['show'],
    actions_metadata:{
      'show':{
        icon:'fas fa-eye',
        condition:{ 
          'status': ['new', 'available', 'broken', 'maintained', 'back from maintainance', 'unusable', 'deleted', 'missing']
        }
      }
    },
    filter_bar_array:[],
    filter_by:{}

  }

 
  /*****************COPY******************/

  form_meta_data : generic_form_meta_data_t = [
    { 
      name:'ID',
      fields:[
        {
          id: 'generalSerialNumber',
          name:'ID',
          type:'text',
          can_edit:false
        },
        {
          id: 'imprentedSerialNumber',
          name:'Serial Number',
          type:'text',
          can_edit:true
        },
        {
          id: 'status',
          name:'Status',
          type:'drop_down',
          possible_values:['new','loaned','available','fixed','inFix','broken','stolen','missing'],
          can_edit:true
        },
        {
          id: 'company',
          name:'Company',
          type:'text',
          can_edit:true
        },
        {
          id: 'ownership',
          name:'Owner',
          type:'text',
          can_edit:true
        },

  ]
    },
    { 
      name:'Instrument Type',
      fields:[
        {
          id: 'type',
          name:'Type',
          type:'drop_down',
          possible_values:['A','B','C'],
          can_edit:false,
        },
        {
          id: 'sub_type',
          name:'Subtype',
          type:'drop_down',
          possible_values:['A1','A2','A3','B1','B2','B3','C1','C2','C3'],
          can_edit:false,
        },
        {
          id: 'style',
          name:'Style',
          type:'text',
          can_edit:false,
        },
      ]
    }  ]

  /*****************COPY******************/
  constructor(private router:Router, private dialog: MatDialog,private http:HttpClient, private route: ActivatedRoute, private crud: CrudService) { }

  edit(){
    const config = new MatDialogConfig()
    config.autoFocus = true
    let dialog_ref = this.dialog.open(GenericFormComponent,config)
    let instance = dialog_ref.componentInstance;
    instance.meta_data =  this.form_meta_data;
    instance.data = this.instrument
    instance.is_add =  false;
    dialog_ref.afterClosed().subscribe(dialog_res => {
      this.crud.update("instruments",dialog_res,this.id).subscribe(res =>{
        if (res !== null){
          for (let key in dialog_res) {
            //update ui
            this.instrument[key] = dialog_res[key];
          }
        } else {
          // output error
        }
      }
      )
    },
    res => {
        if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
    });
    
  }

  loan() {
    this.router.navigate(['/loans'], { queryParams: { instrument_id: this.id } });
  }

  fix(){
    this.router.navigate(['/maintainence'], { queryParams: { instrument_id: this.id } });
  }

  delete(){
    this.crud.delete("instruments", this.id).subscribe(res => {
        this.router.navigate(['/instruments']);
    },
    res => {
        if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
    })
    }
  

  export() {
    alert('exporting')
    let url = `${environment.apiUrl}/api/user/imports/instruments/${this.id}`
    let headers = this.crud.get_headers()
    headers['responseType'] = "blob"
    this.http.get(url, headers)
              .toPromise()
              .then(blob => {
                  saveAs(blob, `instrument_${this.id}.csv`); 
              })
              .catch(err => console.error("download error = ", err))
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('instruments', this.id).subscribe(
        res => {
          this.instrument = res['instrument'];
          for (let i = 0; i < res['history'].length; i++) {
            res['history'][i]['user-data'] = res['history'][i]['user']
            res['history'][i]['user'] = res['history'][i]['user-data']['name']
            
            this.history.push(res['history'][res['history'].length - 1 - i])
          }
          return
       }
       ,
       res => {
           if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
       })
    },
    res => {
        if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
    }) 
  }

}
