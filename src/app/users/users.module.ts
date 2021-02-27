import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { GenericElementsModule } from '../generic-elements/generic-elements.module';
import { StudentsModule } from '../students/students.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [LoginFormComponent, UsersTableComponent],
  imports: [
    CommonModule,
    GenericElementsModule,
    StudentsModule,
    FormsModule
  ],
  exports: [LoginFormComponent]
})
export class UsersModule { }
