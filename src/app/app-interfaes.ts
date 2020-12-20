/*###########################################*/
   /*############ NAV BAR #############*/
import { Type } from '@angular/core';

 
/*###########################################*/
export interface nav_bar_page_t{
    name:string,
    url?:string,    //
    not_apage?:boolean, // default is true
    permisiion:string,
    component:Type<any>,
    dropdown?:nav_bar_page_t[]
  }
  export interface nav_bar_meta_data {
    user_loggedin_enabled:boolean;
    pages: nav_bar_page_t[]
  } 

  
  /*###########################################*/
  export class User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
}