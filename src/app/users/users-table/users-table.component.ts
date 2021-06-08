import { Component, OnInit } from '@angular/core';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';
import { CrudService } from 'src/app/shared-services/crud.service';
import { AccountsService } from '../accounts.service';
import {sha256} from 'js-sha256';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  component_name = "users";
  users_meta_data  = {
    component_name: "users",
    indexing_enabled: true,
    add_button_enabled: true,
    columns_count:8,
    columns:['name', 'username', 'privilege'],
    headers:{
      'name':'First Name',
      'username':'Username',
      'privilege':'Privilege',
    },
    actions:['remove', 'promote', 'demote'],
    actions_metadata:{
      'remove':{
        icon:'fas fa-trash-alt',
        condition:{
        }
      },
      'promote':{
        icon:'fas fa-angle-double-up',
        condition:{
          'privilege':['admin']
        }
    },
      'demote':{
        icon:'fas fa-angle-double-down',
        condition:{
          'privilege':['user']
        }
    }

    },
    filter_bar_array:[],
    filter_by:{}
  }

  form_meta_data : generic_form_meta_data_t = [
    { 
      name:'User Info',
      fields:[
        {
          id: 'name',
          name:'First Name',
          type:'text',
          can_edit:false
        },
        {
          id: 'username',
          name:'Username',
          type:'text',
          can_edit:true
        },
        {
          id: 'password',
          name:'password',
          type:'text',
          can_edit:true
        },
        {
          id: 'privilege',
          name:'Privilege',
          type:'drop_down',
          possible_values:['admin','user'],
          can_edit:true
        },
  ]}]

    functions = {'add': (data_to_show) => {
      const config = new MatDialogConfig()
      config.autoFocus = true
      let dialog_ref = this.dialog.open(GenericFormComponent,config)
      let instance = dialog_ref.componentInstance;
      instance.meta_data =  this.form_meta_data;
      instance.is_add =  true;
      dialog_ref.afterClosed().subscribe(dialog_res => {
        if (dialog_res != null){
          dialog_res.password = sha256(dialog_res.password)
          this.accounts.register(dialog_res).subscribe(res => {
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
      this.accounts.delete_user(i['_id']).subscribe(res => {
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
    'promote': (data_to_show,i) => {

      this.crud.promote_user(i['_id']).subscribe(res => {
        i['privilege'] = 'admin'
      })
    },
    'demote': (data_to_show,i) => {
 
      this.crud.demote_user(i['_id']).subscribe(res => {
        i['privilege'] = 'user'
      })
    },
      
    'show': (data_to_show,i) => {
      alert(`${JSON.stringify(i)}`)
    },
  }
  constructor(private dialog: MatDialog,private crud:CrudService, private accounts:AccountsService) { }

  ngOnInit(): void {
  }

}
