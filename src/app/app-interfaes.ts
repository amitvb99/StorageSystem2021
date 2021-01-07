/*###########################################*/
   /*############ NAV BAR #############*/
import { Type } from '@angular/core';

 
/*###########################################*/
export interface nav_bar_page_t{
    name: string,
    url?: string,    //
    not_apage?: boolean, // default is true
    permission?: string,
    component: Type<any>,
    dropdown?: nav_bar_page_t[]
  }
  export interface nav_bar_meta_data {
    user_loggedin_enabled: boolean;
    pages: nav_bar_page_t[]
  } 

  
  /*###########################################*/
  export class User {
    id: number;
    username: string;
    name: string;
    token: string;
    permission: string;
}


/*###########################################*/

export interface generic_form_field_meta_data_t {
  id: string;
  name: string;
  type: string;
  can_edit?: boolean;
  possible_values?: string[];
  
}

export interface generic_form_group_meta_data_t {
  name: string;
  fields: generic_form_field_meta_data_t[];
  
}

export interface generic_form_meta_data_t  extends Array<generic_form_group_meta_data_t>{}


/*###########################################*/

export interface linear_permission_system {
  list:string[]
}
export interface permission_system_t{
  type:string;
  permissions: linear_permission_system;
}