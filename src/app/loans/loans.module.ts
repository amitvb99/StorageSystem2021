import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoansTableComponent } from './loans-table/loans-table.component';
import { AddLoanComponent } from './add-loan/add-loan.component';
import { GenericElementsModule } from '../generic-elements/generic-elements.module';
import { LoansPageComponent } from './loans-page/loans-page.component';
import { StudentsModule } from '../students/students.module';
import { InstrumentsModule } from '../instruments/instruments.module';
import { LoanPageComponent } from './loan-page/loan-page.component';


@NgModule({
  declarations: [LoansTableComponent, AddLoanComponent, LoansPageComponent, LoanPageComponent],
  imports: [
    StudentsModule,
    InstrumentsModule,
    GenericElementsModule,
    CommonModule
  ]
})
export class LoansModule { }
