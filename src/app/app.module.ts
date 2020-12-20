import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { TableExampleComponent } from './table-example/table-example.component';
import {HttpClientModule} from '@angular/common/http';
import { LoginFormComponent } from './users/login-form/login-form.component'

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    NavBarComponent,
    HomePageComponent,
    TableExampleComponent,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [{provide:LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
