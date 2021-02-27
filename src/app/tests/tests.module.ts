import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTestComponent } from './users-test/users-test.component';
import { LoansTestComponent } from './loans-test/loans-test.component';
import { FilterTestComponent } from './filter-test/filter-test.component';
import { TestsContainerComponent } from './tests-container/tests-container.component';
import { CrudTestComponent } from './crud-test/crud-test.component';
import { BrowserModule } from '@angular/platform-browser';
import { TestsLayoutComponent } from './tests-layout/tests-layout.component';



@NgModule({
  declarations: [UsersTestComponent, LoansTestComponent, FilterTestComponent, TestsContainerComponent, CrudTestComponent, TestsLayoutComponent],
  imports: [
    CommonModule,
    BrowserModule
  ]
})
export class TestsModule { }
