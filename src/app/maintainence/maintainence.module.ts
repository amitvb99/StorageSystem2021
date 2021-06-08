import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFixComponent } from './add-fix/add-fix.component';
import { FixPageComponent } from './fix-page/fix-page.component';
import { FixesPageComponent } from './fixes-page/fixes-page.component';
import { FixesTableComponent } from './fixes-table/fixes-table.component';
import { GenericElementsModule } from '../generic-elements/generic-elements.module';
import { InstrumentsModule } from '../instruments/instruments.module';
import { MaintainersModule } from '../maintainers/maintainers.module';



@NgModule({
  declarations: [AddFixComponent, FixPageComponent, FixesPageComponent, FixesTableComponent],
  imports: [
    MaintainersModule,
    InstrumentsModule,
    GenericElementsModule,
    CommonModule
  ]
})
export class MaintainenceModule { }
