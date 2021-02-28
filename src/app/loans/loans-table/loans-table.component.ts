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
    columns_count:8,
    columns:['instrument', 'student_name', 'student_school', 'student_class', 'user', 'notes', 'from', 'to'],
    headers:{
      'instrument':     'Instrument',
      'student_name':   'Student Name',
      'student_school': 'School',
      'student_grade':  'Class',
      'user':           'Loaning User',
      'notes':          'Notes',
      'from':           'Start Date',
      'to':             'End Date'
    },
    actions:['show'],
    actions_metadata:{
      'show':{
        icon:'fas fa-eye',
        condition:{

        }
    }
    },
    filter_bar_array:['student_grade','instrument_type', 'instrument_subtype'],
    filter_by:{
      'student_grade':["1","2","3","4","5","6"],
      'instrument_type':["4","5","6","7","8","9"],
      'instrument_subtype':["4","5","6","7","8","9"],
    }
  }

  
    functions={
    'show': (data_to_show,i) => {
      alert(`${JSON.stringify(i)}`)
    },
  
  }
  constructor(private dialog: MatDialog,private crud:CrudService) { }

  ngOnInit(): void {
  }

}
