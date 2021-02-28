import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { TableExampleComponent } from './table-example/table-example.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginFormComponent } from './users/login-form/login-form.component'
import { GenericElementsModule } from './generic-elements/generic-elements.module';
import { StudentsModule } from './students/students.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { PopupModule } from '@progress/kendo-angular-popup';
import { MatDialogModule } from '@angular/material/dialog';
import { LoansModule } from './loans/loans.module';
import { TestsModule } from './tests/tests.module';
import { UsersModule } from './users/users.module';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomePageComponent,
    TableExampleComponent,
    // LoginFormComponent
  ],
  imports: [
    GenericElementsModule,
    PopupModule,
    MatDialogModule,
    InstrumentsModule,
    StudentsModule,
    TestsModule,
    LoansModule,
    UsersModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [{provide:LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent],
  entryComponents: [TableExampleComponent]
  

})
export class AppModule { }
