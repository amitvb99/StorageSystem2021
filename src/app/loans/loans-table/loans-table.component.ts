import { Component, OnInit } from '@angular/core';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CrudService } from 'src/app/shared-services/crud.service';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';

@Component({
  selector: 'app-loans-table',
  templateUrl: './loans-table.component.html',
  styleUrls: ['./loans-table.component.css']
})
export class LoansTableComponent implements OnInit {
  component_name = "loans";
  students_meta_data  = {
    component_name: "loans",
    indexing_enabled :true,
    add_button_enabled: false,
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
      alert(`${JSON.stringify(i)}`)
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
  constructor(private dialog: MatDialog,private crud:CrudService) { }

  ngOnInit(): void {
  }

}
