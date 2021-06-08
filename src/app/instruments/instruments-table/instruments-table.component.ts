import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';
import { CrudService } from 'src/app/shared-services/crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instruments-table',
  templateUrl: './instruments-table.component.html',
  styleUrls: ['./instruments-table.component.css']
})
export class InstrumentsTableComponent implements OnInit {
  @Input() overrider;
  @Input() data: any = undefined;
  
  component_name = "instruments";
  instruments_meta_data  = {
    component_name: "instruments",
    indexing_enabled : true,
    add_button_enabled: true,
    discrete_filter_bar: true,
    free_text_filter_bar: true,
    columns_count:8,
    columns:['generalSerialNumber', 'type', 'sub_type', 'company', 'style', 'imprentedSerialNumber', 'ownership', 'status'],
    headers:{
      'generalSerialNumber':'Id',
      'type':'Type',
      'sub_type':'Subtype',
      'company':'Company',
      'style':'Style',
      'imprentedSerialNumber':'Serial Number',
      'ownership':'Owner',
      'status':'Status'
      
    },
    actions:['remove','edit','show'],
    actions_metadata:{
      'remove':{
        icon:'fas fa-trash-alt',
        condition:{
            'availability':[0]
        }
      },
      'edit':{
        icon:'fas fa-cog',
        condition:{
          
        }
      },
      'show':{
        icon:'fas fa-eye',
        condition:{

        }
    }
    },
    filter_bar_array:['type','subtype','status'],
    filter_by:{
      'type':["A","B","C"],
      'subtype':{'type':{'A':['A1', 'A2', 'A3'], 'B':['B1', 'B2', 'B3'], 'C':['C1', 'C2', 'C3']} },
      'status':["loaned","missing","available"]
    }
  }




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
          possible_values:['new','loaned','available','broken','maintained','back from maintainance','unusable','deleted','missing'],
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
  constructor(private dialog: MatDialog,private crud:CrudService, private router:Router) { }

  // close_func = () => {
  //   this.dialog.componentInstance.cl
  // }
  functions={'add': (data_to_show) => {
    const config = new MatDialogConfig()
    config.autoFocus = true
    let dialog_ref = this.dialog.open(GenericFormComponent,config)
    let instance = dialog_ref.componentInstance;
    instance.meta_data =  this.form_meta_data;
    instance.is_add =  true;
    dialog_ref.afterClosed().subscribe(dialog_res => {
      if (dialog_res != null){
        this.crud.create(this.component_name,dialog_res).subscribe(res => {
          if(res != null){
            // dialog_res
            dialog_res._id = res['data']
            data_to_show.push(dialog_res)
          } else {
            // output error
          }
        })
      }
    });

  },
  'remove': (data_to_show,i) => {
    this.crud.delete(this.component_name,i['generalSerialNumber']).subscribe(res => {
      if (res !== null){
        const index = data_to_show.indexOf(i, 0);
        if (index > -1) {
          data_to_show.splice(index, 1);
        }
      } else {
        //output error
      }

    })
    },
  'edit': (data_to_show,i) => {
    const config = new MatDialogConfig()
    config.autoFocus = true
    let dialog_ref = this.dialog.open(GenericFormComponent,config)
    let instance = dialog_ref.componentInstance;
    instance.meta_data =  this.form_meta_data;
    instance.data = i
    instance.is_add =  false;
    dialog_ref.afterClosed().subscribe(dialog_res => {
      this.crud.update(this.component_name,dialog_res,dialog_res['_id']).subscribe(res =>{
        if (res !== null){
          for (let key in dialog_res) {
            //update ui
            i[key] = dialog_res[key];
          }
        } else {
          // output error
        }
      }
      )
    });
    
  },
  'show': (data_to_show,i) => {
      this.router.navigate(['/instruments/', i['_id']]);
      // alert(`${JSON.stringify(i)}`)
  },

}
  ngOnInit(): void {
    if (this.overrider != undefined) {
      var new_values = this.overrider(this.functions, this.instruments_meta_data)
      this.functions = new_values[0]
      this.instruments_meta_data = new_values[1]
    }
  }

}
