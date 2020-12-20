import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../users/accounts.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private accounts: AccountsService) { }
  userFirstName = '';
  ngOnInit(): void {
    this.userFirstName = this.accounts.get_user_firs_name()
    // this.userFirstName = JSON.parse(localStorage.getItem('user')).firstName;
    // if (this.userFirstName === undefined || this.userFirstName === null) {
    //   this.userFirstName = 'Guest'
    // }
    // console.log(this.userFirstName)
  }

}
