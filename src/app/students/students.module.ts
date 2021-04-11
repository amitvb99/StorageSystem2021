import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsTableComponent } from './students-table/students-table.component';
import { GenericElementsModule } from '../generic-elements/generic-elements.module';
import { StudentPageComponent } from './student-page/student-page.component';
import { InstrumentsModule } from '../instruments/instruments.module';



@NgModule({
  declarations: [StudentsTableComponent, StudentPageComponent],
  imports: [
    GenericElementsModule,
    InstrumentsModule,
    CommonModule
  ],
  exports: [StudentsTableComponent]
})
export class StudentsModule { }
