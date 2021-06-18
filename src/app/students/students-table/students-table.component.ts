import { Component, OnInit, Input } from '@angular/core';
import { generic_form_meta_data_t } from 'src/app/app-interfaes';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CrudService } from 'src/app/shared-services/crud.service';
import { GenericFormComponent } from 'src/app/generic-elements/generic-form/generic-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.css']
})
export class StudentsTableComponent implements OnInit {
  @Input() overrider;
  component_name = "students";
  students_meta_data  = {
    component_name: "students",
    indexing_enabled: true,
    add_button_enabled: true,
    columns_count:8,
    columns:['fName', 'lName', 'school', 'level', 'class'],
    headers:{
      'fName':'First Name',
      'lName':'Last Name',
      'school':'School',
      'level':'Level',
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
    filter_bar_array:['class','level'],
    filter_by:{
      'class':["1","2","3","4","5","6"],
      'level':["4","5","6","7","8","9"],
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
          id: 'level',
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
      name:'Parents Info',
      fields:[
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
        {
          id: 'parent1PhoneNumber',
          name:'Parent 1 Number',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent2PhoneNumber',
          name:'Parent 2 Number',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent1Email',
          name:'Parent 1 Email',
          type:'text',
          can_edit:false,
        },
        {
          id: 'parent2Email',
          name:'Parent 2 Email',
          type:'text',
          can_edit:false,
        },
      ]
    }  ]

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
  
      },
      res => {
          if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
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
        },
        res => {
            if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
        }
        )
      },
      res => {
          if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
      });
      
    },
    'show': (data_to_show,i) => {
      this.router.navigate(['/students/', i['_id']]);
      // alert(`${JSON.stringify(i)}`)
    },
  }
  
  constructor(private dialog: MatDialog,private crud:CrudService, private router:Router) { }

  

  ngOnInit(): void {
    if (this.overrider != undefined) {
      var new_values = this.overrider(this.functions, this.students_meta_data)
      this.functions = new_values[0]
      this.students_meta_data = new_values[1]
    } else {
    }
  }

}
