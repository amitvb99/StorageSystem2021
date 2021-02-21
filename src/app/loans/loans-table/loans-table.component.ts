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
  component_name = "students";
  students_meta_data  = {
    component_name: "students",
    indexing_enabled :true,
    columns_count:8,
    columns:['fName', 'lName', 'school', 'grade', 'class'],
    headers:{
      'fName':'First Name',
      'lName':'Last Name',
      'school':'School',
      'grade':'Level',
      'class':'Class',
    },
    actions:['remove','edit','show'],
    actions_metadata:{
      'remove':{
        icon:'fas fa-trash-alt',
        condition:{
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
    filter_bar_array:['class','grade'],
    filter_by:{
      'class':["1","2","3","4","5","6"],
      'grade':["4","5","6","7","8","9"],
    }

  }

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
          id: 'grade',
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
      name:'Instrument Type',
      fields:[
        {
          id: 'id',
          name:'ID',
          type:'text',
          can_edit:false,
        },
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
      ]
    }  ]

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
              data_to_show.push(dialog_res)
            } else {
              // output error
            }
          })
        }
      });
  
    },
    'remove': (data_to_show,i) => {
      this.crud.delete(this.component_name,i['_id']).subscribe(res => {
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
      alert(`${JSON.stringify(i)}`)
    },
  
  }
  constructor(private dialog: MatDialog,private crud:CrudService) { }

  ngOnInit(): void {
  }

}
