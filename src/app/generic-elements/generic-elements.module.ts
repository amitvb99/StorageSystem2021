import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './generic-table/generic-table.component';
import { GenericFormComponent } from './generic-form/generic-form.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [TableComponent, GenericFormComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[TableComponent]
})
export class GenericElementsModule { }
