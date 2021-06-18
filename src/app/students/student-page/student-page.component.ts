import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import {HttpHeaders} from "@angular/common/http";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.css']
})
export class StudentPageComponent implements OnInit {
  id: string = '0'
  student = {}
  loans = []
  loans_meta_data  = {
    component_name: "loans",
    indexing_enabled :true,
    add_button_enabled: false,
    export_button_enabled: false,
    discrete_filter_bar: false,
    free_text_filter_bar: false,
    columns_count:9,
    columns:['instrument', 'student_name', 'student_school', 'student_class', 'openning_user', 'closing_user', 'notes', 'from', 'status', 'to'],
    headers:{
      'instrument':     'Instrument',
      'student_name':   'Student Name',
      'student_school': 'School',
      'student_class':  'Class',
      'openning_user':  'Opening User',
      'closing_user':   'Closing User',
      'notes':          'Notes',
      'from':           'Start Date',
      'status':         'Status',
      'to':             'End Date'
    },
    actions:['show', 'end_loan'],
    actions_metadata:{
      'show':{
        icon:'fas fa-eye fa-2x',
        condition:{

        }
    },
    'end_loan':{
      icon:'fas fa-exchange-alt fa-2x',
      condition:{
        'status': ['closed']
      }
  }
    },
    filter_bar_array:['student level', 'student class', 'status', 'instrument type', 'instrument subtype'],
    filter_by:{
      'student level':      ["4","5","6","7","8","9"],
      'student class':      ["1","2","3","4","5","6"],
      'status':             ['openned', 'closed'],
      'instrument type':    ["4","5","6","7","8","9"],
      'instrument subtype': ["4","5","6","7","8","9"],
    }
  }

  
    functions={
    'show': (data_to_show,i) => {
      this.router.navigate(['/loans/', i['_id']])
    },
    'end_loan': (data_to_show,i) => {
      var loan_id = i._id
      this.crud.end_loan(loan_id).subscribe(res => {
        if (res !== null){
          const index = data_to_show.indexOf(i, 0);
          i.status = 'closed'
        } else {
          //output error
        }
  
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


  /************************COPY******************************/
  form_meta_data : generic_form_meta_data_t = [
    { 
      name:'Student Info',
      fields:[
        {
          id: 'fName',
          name:'First Name',
          type:'text',
          can_edit:false
        },
        {
          id: 'lName',
          name:'Last Name',
          type:'text',
          can_edit:true
        },
        {
          id: 'school',
          name:'School',
          type:'text',
          can_edit:true
        },
        {
          id: 'level',
          name:'Level',
          type:'drop_down',
          possible_values:["4","5","6","7","8","9"],
          can_edit:true
        },
        {
          id: 'class',
          name:'Class',
          type:'drop_down',
          possible_values:["1","2","3","4","5","6"],
          can_edit:true
        },

  ]
    },
    { 
      name:'Parents Info',
      fields:[
        {
          id: 'parent1Name',
          name:'Parent 1 Name',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent2Name',
          name:'Parent 2 Name',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent1PhoneNumber',
          name:'Parent 1 Number',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent2PhoneNumber',
          name:'Parent 2 Number',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent1Email',
          name:'Parent 1 Email',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent2Email',
          name:'Parent 2 Email',
          type:'text',
          can_edit:false,
        },
      ]
    }  ]
    
/************************COPY******************************/

  constructor(private dialog: MatDialog, private http: HttpClient, private route: ActivatedRoute, private crud: CrudService, private router: Router) { }

  instrument_overrider = (functions, table_metadata) => {
    table_metadata.actions = []
    table_metadata.actions_metadata = {}
    table_metadata.add_button_enabled = false;
    table_metadata.indexing_enabled = false;
    table_metadata.discrete_filter_bar = false;
    table_metadata.free_text_filter_bar = false;

    var res = [{}, table_metadata]
    return res
  }

  loan(){
    this.router.navigate(['/loans'], { queryParams: { student_id: this.id } });
  }

  edit(){
      const config = new MatDialogConfig()
      config.autoFocus = true
      let dialog_ref = this.dialog.open(GenericFormComponent,config)
      let instance = dialog_ref.componentInstance;
      instance.meta_data =  this.form_meta_data;
      instance.data = this.student
      instance.is_add =  false;
      dialog_ref.afterClosed().subscribe(dialog_res => {
        this.crud.update("students",dialog_res,this.id).subscribe(res =>{
          if (res !== null){
            for (let key in dialog_res) {
              //update ui
              this.student[key] = dialog_res[key];
            }
          } else {
            // output error
          }},
          res => {
              if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
          })});}

  delete(){
    this.crud.delete("students", this.id).subscribe(res => {
        this.router.navigate(['/students']);
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
    let url = `${environment.apiUrl}/api/user/imports/students/${this.id}`
    let headers = this.crud.get_headers()
    headers['responseType'] = "blob"
    this.http.get(url, headers)
              .toPromise()
              .then(blob => {
                  saveAs(blob, `student_${this.id}.csv`); 
              })
              .catch(err => console.error("download error = ", err))
  }
              
            
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('students', this.id).subscribe(
        res => {
          this.student = res['student'];
          for (let i = 0; i < res['loans'].length; i++){
            this.crud.fix_loan(res['loans'][i])
            this.loans.push(res['loans'][i])
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
    }) 
  }
}



