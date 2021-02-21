import { Component, OnInit, Input } from '@angular/core';
import { timer } from 'rxjs';
import {sha256} from 'js-sha256';
import { NgForm } from '@angular/forms';
import { AccountsService } from '../accounts.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  constructor(private accounts:AccountsService,private router:Router) { }
  path = '/api/user/login'
  logout_path = '/api/logout'

  enable_forgot_pass = true;
  ngOnInit(): void {

  }

  errors  = {user_error:false, pass_error:false}
  flash_error_for(error_type){
    this.errors[error_type] = false
    const source = timer(0, 1000);

    var abc = source.subscribe(val => {
      this.errors[error_type] = !this.errors[error_type]
      if(val = 1){
        abc.unsubscribe()
      }
    });
  }
  login (form: NgForm){
    var err = false
    if (form.value.username == ""){
      this.flash_error_for('user_error')
      err = true
    }

    if (form.value.password == ""){
      this.flash_error_for('pass_error')
      err = true
    }
    
    if (err) {
      return;
    }
    // var user = {'username':form.value.username,'password':sha256(form.value.password)}
    var user = {'username':form.value.username,'password':form.value.password}
    this.accounts.login(user,this.path)
    .subscribe(val =>{
      console.log(val)
      this.router.navigateByUrl('home')
    })



  }

}
