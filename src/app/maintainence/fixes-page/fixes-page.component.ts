import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fixes-page',
  templateUrl: './fixes-page.component.html',
  styleUrls: ['./fixes-page.component.css']
})
export class FixesPageComponent implements OnInit {
  global_cfg: any = [];
  maintainer = undefined
  instrument = undefined
  
  show_instruments = false
  show_maintainers = false

  show_functions = {
    'maintainer': () => {
      this.show_instruments = false
      this.show_maintainers = true
    },
    'instrument': () => {
      this.show_instruments = true
      this.show_maintainers = false
    },
    'fix': () => {
      this.show_instruments = false
      this.show_maintainers = false
    }
  }
  choose_student(s) {
    this.maintainer = s
  }

  choose_instrument(i) {
    this.instrument = i
  }

  maintainer_overrider = (functions, table_metadata) => {
    var new_functions = {
      'choose': (data_to_show, i) =>
          {
            console.log(i)
            this.maintainer = i            
          }
        }
    table_metadata.actions = ['choose']
    table_metadata.add_button_enabled = false;
    table_metadata.export_button_enabled = false;
    
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
    table_metadata.export_button_enabled = false;

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

  back_to_fixes_table() {
    this.show_instruments = false
    this.show_maintainers = false
  }

}
