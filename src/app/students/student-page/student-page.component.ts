import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import {HttpHeaders} from "@angular/common/http";

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
  
      })
      }
    
  
  }
  constructor(private http: HttpClient, private route: ActivatedRoute, private crud: CrudService, private router: Router) { }

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

  export() {
    alert('exporting')
    let url = `${environment.apiUrl}/api/user/imports/students/:${this.id}`
    this.http.get(url, {responseType: "blob"})
              .toPromise()
              .then(blob => {
                  saveAs(blob, `student_${this.id}.gz`); 
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
          console.log(this.loans);
        }
      )
    }) 
  }
}



