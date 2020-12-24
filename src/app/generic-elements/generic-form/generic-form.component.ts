import { Component, OnInit, Input } from '@angular/core';
import { generic_form_meta_data_t, generic_form_group_meta_data_t, generic_form_field_meta_data_t } from 'src/app/app-interfaes';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css']
})
export class GenericFormComponent implements OnInit {

  @Input() meta_data: generic_form_meta_data_t; 
  @Input() data; 
  @Input() is_add: boolean; 
  constructor( private mdDialogRef: MatDialogRef<GenericFormComponent>) { }


  close() {
    this.mdDialogRef.close(null)
  }

  submit(){
      this.mdDialogRef.close(this.data);
  }
  ngOnInit(): void {
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
            this.close();
        }
    });

    this.mdDialogRef.backdropClick().subscribe(event => {
      this.close();
    });

    if (this.data == undefined){
      this.data = {}
      for (let group of this.meta_data) {
          for (let field of group.fields){
            this.data[field.id] = ''
          }

      }
    } else {
      var new_copy = {};
      Object.assign(new_copy, this.data);
      this.data = new_copy
    }
  }

}
