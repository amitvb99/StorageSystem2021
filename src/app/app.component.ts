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

const permission_system : permission_system_t = {
  type: 'linear',
  permissions: {
    list: ['admin','user']
  }
}

const meta_data  = {
  user_loggedin_enabled:true,
  pages:[
    {
      name:'Home',
      url:'#/home',
      permission:'user',
      component:HomePageComponent
    },
    {
      name:'Users',
      url:'#/home',
      permission:'admin',
      component:HomePageComponent
    },
    {
      name:'Students',
      url:'#/students',
      permission:'user',
      component:StudentsTableComponent
    },
    {
      name:'Instruments',
      url:'#/instruments',
      permission:'user',
      component:InstrumentsTableComponent
    },
    {
      name:'login',
      url:'#/login',
      not_apage:true,
      component:LoginFormComponent
    },
    {
      name:'Orders',
      url:'#/orders',
      permission:'user',
      component:TableExampleComponent
    },
    {
      name:'Items',
      url:'#/items',
      permission:'user',
      component:TableExampleComponent
    },
    {
      name:'category',
      dropdown:[
        {
            name:'category A',
            url:'#/cat/ca',
            component:TableExampleComponent
        },
        {
          name:'category B',
          url:'#/cat/cb',
          component:TableExampleComponent
        },
        {
          name:'category C',
          url:'#/cat/cc',
          permission:'admin',
          component:TableExampleComponent
        }],
      permission:'user'
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
