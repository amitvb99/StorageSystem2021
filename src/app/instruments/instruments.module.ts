import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentsTableComponent } from './instruments-table/instruments-table.component';
import { GenericElementsModule } from '../generic-elements/generic-elements.module';



@NgModule({
  declarations: [InstrumentsTableComponent],
  imports: [
    GenericElementsModule,
    CommonModule,
  ], 
  exports:[InstrumentsTableComponent]
})
export class InstrumentsModule { }
