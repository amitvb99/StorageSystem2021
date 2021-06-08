import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route,Routes, RouterModule } from '@angular/router';
import { nav_bar_meta_data, nav_bar_page_t, permission_system_t } from '../app-interfaes';
import { AccountsService } from '../users/accounts.service';
import { Router } from '@angular/router';
import { PermissionSystemService } from '../generic-elements/permission-system.service';



 
@Component({
  selector: 'fixed-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  


  @Input() nav_meta_data:nav_bar_meta_data;
  
  is_collapsed = true
  
  constructor(private accounts:AccountsService,private permission_system:PermissionSystemService,private router:Router) { }
  
  ngOnInit(): void {
  }

  cant_access(page: nav_bar_page_t){
    if(page.permission != undefined) {
      return !this.permission_system.have_permission(page.permission)
    }
    return false // means user can access
  }

  isloggedin(){
    return this.accounts.isloggedin();
  }
  
  get_user_firs_name(){
    return this.accounts.get_user_firs_name();
  }

  get_button_text(){
    return this.accounts.get_user_firs_name() == 'Guest'?'Login':'Logout';
  }
  log_in_out(){
    if (this.accounts.isloggedin()){
      this.accounts.logout();
      this.router.navigateByUrl('students')
      //refirect to home
    } else {
      this.router.navigateByUrl('login')
      //redirect to login page
    }
  }
  collapse(){
    this.is_collapsed = !this.is_collapsed 
  }
}
