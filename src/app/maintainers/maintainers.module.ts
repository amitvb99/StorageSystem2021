import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintainersTableComponent } from './maintainers-table/maintainers-table.component';
import { MaintainerPageComponent } from './maintainer-page/maintainer-page.component';
import { GenericElementsModule } from '../generic-elements/generic-elements.module';
import { InstrumentsModule } from '../instruments/instruments.module';

@NgModule({
  declarations: [MaintainersTableComponent, MaintainerPageComponent],
  imports: [
    GenericElementsModule,
    InstrumentsModule,
    CommonModule
  ]
})
export class MaintainersModule { }
