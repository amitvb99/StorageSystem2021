import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';
import { CrudService } from 'src/app/shared-services/crud.service';

@Component({
  selector: 'app-maintainers-table',
  templateUrl: './maintainers-table.component.html',
  styleUrls: ['./maintainers-table.component.css']
})
export class MaintainersTableComponent implements OnInit {

  @Input() overrider;
  component_name = "maintainers";
  students_meta_data  = {
    component_name: "maintainers",
    indexing_enabled: true,
    add_button_enabled: true,
    columns_count:3,
    columns:['maintainerName', 'maintainerPhone', 'maintainerAddress'],
    headers:{
      'maintainerName':'Name',
      'maintainerPhone':'Phone Number',
      'maintainerAddress':'Address',
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
    filter_bar_array:[],
    filter_by:{
    }
  }

  form_meta_data : generic_form_meta_data_t = [
    { 
      name:'Maintainer Info',
      fields:[
        {
          id: 'maintainerName',
          name:'Name',
          type:'text',
          can_edit:true
        },
        {
          id: 'maintainerPhone',
          name:'Phone Number',
          type:'text',
          can_edit:true
        },
        {
          id: 'maintainerAddress',
          name:'Address',
          type:'text',
          can_edit:true
        }
      ]
    }
  ]

  functions = {'add': (data_to_show) => {
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
    this.router.navigate(['/maintainers/', i['_id']]);
  },
}


  constructor(private dialog: MatDialog,private crud:CrudService, private router:Router) { }


  ngOnInit(): void {
    if (this.overrider != undefined) {
      var new_values = this.overrider(this.functions, this.students_meta_data)
      this.functions = new_values[0]
      this.students_meta_data = new_values[1]
    } else {
      console.log('use default values')
    }
  }

}
