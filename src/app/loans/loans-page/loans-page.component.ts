import { Component, OnInit } from '@angular/core';
import { InstrumentsTableComponent } from 'src/app/instruments/instruments-table/instruments-table.component';
import { DeclareFunctionStmt } from '@angular/compiler';

@Component({
  selector: 'app-loans-page',
  templateUrl: './loans-page.component.html',
  styleUrls: ['./loans-page.component.css']
})
export class LoansPageComponent implements OnInit {

  global_cfg: any = {};
  student = undefined
  instrument = undefined
  
  show_instruments = false
  show_students = false

  show_functions = {
    'student': () => {
      this.show_instruments = false
      this.show_students = true
    },
    'instrument': () => {
      this.show_instruments = true
      this.show_students = false
    },
    'loan': () => {
      this.show_instruments = false
      this.show_students = false
    }
  }
  choose_student(s) {
    this.student = s
  }

  choose_instrument(i) {
    this.instrument = i
  }

  
  student_overrider = (functions, table_metadata) => {
    var new_functions = {
      'choose': (data_to_show, i) =>
          {
            console.log(i)
            this.student = i            
          }
        }
    table_metadata.actions = ['choose']
    table_metadata.add_button_enabled = false;
    
    table_metadata.actions_metadata = {
      'choose':{
        icon:'fas fa-share-square',
        condition:{ }
    }}

    var res = [new_functions, table_metadata]
    return res
  }

  instrument_overrider = (functions, table_metadata) => {
    var new_functions = {
      'choose': (data_to_show, i) =>
          {
            this.instrument = i            
          }
        }

    table_metadata.actions = ['choose']
    table_metadata.add_button_enabled = false;
    table_metadata.actions_metadata = {
      'choose':{
        icon:'fas fa-share-square',
        condition:{ }
      }
    }

    var res = [new_functions, table_metadata]
    return res
  }
  constructor() { }

  ngOnInit(): void {
    
  }

  back_to_leans_table() {
    this.show_instruments = false
    this.show_students = false
  }

}
