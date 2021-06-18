import { Component, Input, OnInit } from '@angular/core';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CrudService } from 'src/app/shared-services/crud.service';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loans-table',
  templateUrl: './loans-table.component.html',
  styleUrls: ['./loans-table.component.css']
})
export class LoansTableComponent implements OnInit {
  component_name = "loans";
  @Input() global_cfg: any = {};
  @Input() data: any;
  loans_meta_data  = {
    component_name: "loans",
    indexing_enabled :true,
    add_button_enabled: false,
    export_button_enabled: false,
    columns_count:9,
    columns:['instrument', 'student_name', 'student_school', 'student_class', 'openning_user', 'closing_user', 'from', 'status', 'to'],
    headers:{
      'instrument':     'Instrument',
      'student_name':   'Student Name',
      'student_school': 'School',
      'student_class':  'Class',
      'openning_user':  'Opening User',
      'closing_user':   'Closing User',
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
          
          this.crud.read('loans', loan_id).subscribe(loan => {
            i.status = 'closed'
            i.to = loan.to
            i.closing_user = loan['closeUser']['name']
          },
          res => {
              if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
          })
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
  constructor(private dialog: MatDialog,private crud:CrudService, private router: Router) { }

  ngOnInit(): void {
  }

}
