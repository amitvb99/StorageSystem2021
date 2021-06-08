import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';

@Component({
  selector: 'app-fixes-table',
  templateUrl: './fixes-table.component.html',
  styleUrls: ['./fixes-table.component.css']
})
export class FixesTableComponent implements OnInit {

  component_name = "fixes";
  @Input() global_cfg: any = {};
  @Input() data: any;
  fixes_meta_data  = {
    component_name: "fixes",
    indexing_enabled :true,
    add_button_enabled: false,
    export_button_enabled: false,
    columns_count:9,
    columns:['instrument', 'maintainer_name', 'maintainer_phone', 'maintainer_address', 'openning_user', 'closing_user', 'from', 'status', 'to'],
    headers:{
      'instrument':     'Instrument',
      'maintainer_name':   'Maintainer Name',
      'maintainer_phone': 'Maintainer Phone',
      'maintainer_address':  'Maintainer Address',
      'openning_user':  'Opening User',
      'closing_user':   'Closing User',
      'from':           'Start Date',
      'status':         'Status',
      'to':             'End Date'
    },
    actions:['show', 'end_fix'],
    actions_metadata:{
      'show':{
        icon:'fas fa-eye fa-2x',
        condition:{

        }
    },
    'end_fix':{
      icon:'fas fa-exchange-alt fa-2x',
      condition:{
        'status': ['done']
      }
  }
    },
    filter_bar_array:[ 'status', 'instrument type', 'instrument subtype'],
    filter_by:{
      'status':             ['inProgress', 'done'],
      'instrument type':    ["4","5","6","7","8","9"],
      'instrument subtype': ["4","5","6","7","8","9"],
    }
  }

  functions={
    'show': (data_to_show,i) => {
      this.router.navigate(['/fixes/', i['_id']])
    },
    'end_fix': (data_to_show,i) => {
      var fix_id = i._id
      this.crud.end_fix(fix_id).subscribe(res => {
        if (res !== null){
          const index = data_to_show.indexOf(i, 0);
          i.status = 'done'
          this.crud.read('fixes', fix_id).subscribe(fix => {
            i.to = fix.to
          })
        } else {
          //output error
        }
  
      })
      }
    
  
  }
  constructor(private dialog: MatDialog,private crud:CrudService, private router: Router) { }

  ngOnInit(): void {
  }

}
