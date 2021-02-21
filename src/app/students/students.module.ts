import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsTableComponent } from './students-table/students-table.component';
import { GenericElementsModule } from '../generic-elements/generic-elements.module';



@NgModule({
  declarations: [StudentsTableComponent],
  imports: [
    GenericElementsModule,
    CommonModule
  ],
  exports: [StudentsTableComponent]
})
export class StudentsModule { }
