import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { TableExampleComponent } from './table-example/table-example.component';
import { LoginFormComponent } from './users/login-form/login-form.component';

import { nav_bar_page_t, permission_system_t } from './app-interfaes';
import { hasClassName } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { StudentsTableComponent } from './students/students-table/students-table.component';
import { InstrumentsTableComponent } from './instruments/instruments-table/instruments-table.component';
import { GenericFormComponent } from './generic-elements/generic-form/generic-form.component';
import { PermissionSystemService } from './generic-elements/permission-system.service';
import { LoansPageComponent } from './loans/loans-page/loans-page.component';
import { TestsContainerComponent } from './tests/tests-container/tests-container.component';
import { UsersTableComponent } from './users/users-table/users-table.component';
import { StudentPageComponent } from './students/student-page/student-page.component';
import { InstrumentPageComponent } from './instruments/instrument-page/instrument-page.component';
import { LoanPageComponent } from './loans/loan-page/loan-page.component';
import { ImportsPageComponent } from './imports/imports-page/imports-page.component';
import { MaintainersTableComponent } from './maintainers/maintainers-table/maintainers-table.component';
import { MaintainerPageComponent } from './maintainers/maintainer-page/maintainer-page.component';


const permission_system : permission_system_t = {
  type: 'linear',
  permissions: {
    list: ['admin','user']
  }
}

const meta_data  = {
  user_loggedin_enabled:true,
  pages:[
    // {
    //   name:'Home',
    //   url:'#/home',
    //   permission:'user',
    //   component:HomePageComponent
    // },
    {
      name:'Users',
      url:'#/users',
      permission:'admin',
      component:UsersTableComponent
    },
    {
      name:'Students',
      url:'#/students',
      permission:'user',
      component:StudentsTableComponent
    },
    {
      name:'Loans',
      url:'#/loans',
      permission:'user',
      component:LoansPageComponent
    },
    {
      name:'Instruments',
      url:'#/instruments',
      permission:'user',
      component:InstrumentsTableComponent
    },
    {
      name:'Maintainers',
      url:'#/maintainers',
      permission:'user',
      component:MaintainersTableComponent
    },
    {
      name:'login',
      url:'#/login',
      not_apage:true,
      component:LoginFormComponent
    },
    {
      name:'imports',
      url:'#/imports',
      permission:'user',
      component:ImportsPageComponent
    },
    // {
    //   name:'Orders',
    //   url:'#/orders',
    //   permission:'user',
    //   component:TableExampleComponent
    // },
    // {
    //   name:'Items',
    //   url:'#/items',
    //   permission:'user',
    //   component:TableExampleComponent
    // },
    // {
    //   name:'category',
    //   dropdown:[
    //     {
    //         name:'category A',
    //         url:'#/cat/ca',
    //         component:TableExampleComponent
    //     },
    //     {
    //       name:'category B',
    //       url:'#/cat/cb',
    //       component:TableExampleComponent
    //     },
    //     {
    //       name:'category C',
    //       url:'#/cat/cc',
    //       permission:'admin',
    //       component:TableExampleComponent
    //     }],
    //   permission:'user'
    // },
    // {
    //   name:'Tests',
    //   url:'#/tests',
    //   permission:'user',
    //   not_apage:true,
    //   component:TestsContainerComponent
    // },
    {
      name:'student',
      url:'#/students/:id',
      permission:'user',
      not_apage:true,
      component:StudentPageComponent
    },
    {
      name:'instrument',
      url:'#/instruments/:id',
      permission:'user',
      not_apage:true,
      component:InstrumentPageComponent
    },
    {
      name:'loans',
      url:'#/loans/:id',
      permission:'user',
      not_apage:true,
      component:LoanPageComponent
    },
    {
      name:'loans',
      url:'#/maintainers/:id',
      permission:'user',
      not_apage:true,
      component:MaintainerPageComponent
    }
  ]}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'base-project';
  nav_1 = meta_data;

  constructor(private permission_system_service: PermissionSystemService) { 

  }
  ngOnInit(): void {
    this.permission_system_service.init(permission_system)
  }
  static get_routes(): Routes{
 
    let get_routes_helper = function(pages) {
      let routes: Routes = [

      ];
      for (let page of pages ){
        if (page.dropdown) {
          routes  = routes.concat(get_routes_helper(page.dropdown))
        } else {
          routes.push({path: page.url.substring(2),component:page.component})
          // routes.push({path:'orders',component:page.component})
        }
      }
      return routes;
    }
    return get_routes_helper(meta_data.pages)
     
  }  

  
}
