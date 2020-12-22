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
  front_to_server = JSON.stringify({"username":"[the string the user inserted]","password":"[sha256 hash for the string inserted by user ]"})
  login_server_to_front = JSON.stringify({"name":"[user Full Name]", "token":"[string from server per session]", "username":"[user username]"})
  register_front_to_server = JSON.stringify({"name":"[the full name of the user]","username":"[the string the user inserted]","password":"[the string inserted by user ]"})
  register_server_to_front = JSON.stringify({"message":"User Created!"})
  students_server_to_front = JSON.stringify({"message":"Students fetched successfully!","students":"[list of json objcts contains students]"})
  student_server_to_front = JSON.stringify({"student":"[student details]"})
  addStudent_front_to_server = JSON.stringify({"fName":"[the string the user inserted]",
  "lName":"[the string the user inserted]",
  "school":"[the string inserted by user ]",
  "grade":"[the string inserted by user ]",
  "class":"[the string inserted by user ]",
  "id":"[the string inserted by user ]",
  "parent1Name":"[the string inserted by user ]",
  "parent2Name":"[the string inserted by user ]",
  "parent1PhoneNumber":"[the string inserted by user ]",
  "parent2PhoneNumber":"[the string inserted by user ]",
  "parent1Email":"[the string inserted by user ]",
  "parent2Email":"[the string inserted by user ]",})
  instruments_server_to_front = JSON.stringify({"message":"Instruments fetched successfully!","instruments":"[list of json objcts contains instruments]"})
  instrument_server_to_front = JSON.stringify({"instrument":"[instrumetn details]"})
  addInstrument_front_to_server = JSON.stringify({"generalSerialNumber":"[the string the user inserted]",
  "type":"[the string the user inserted]",
  "sub_type":"[the string inserted by user ]",
  "company":"[the string inserted by user ]",
  "model":"[the string inserted by user ]",
  "imprentedSerialNumber":"[the string inserted by user ]",
  "ownership":"[the string inserted by user ]",
  "status":"[the string inserted by user ]"})





  ngOnInit(): void {
    this.userFirstName = this.accounts.get_user_firs_name()
    // this.userFirstName = JSON.parse(localStorage.getItem('user')).firstName;
    // if (this.userFirstName === undefined || this.userFirstName === null) {
    //   this.userFirstName = 'Guest'
    // }
    // console.log(this.userFirstName)
  }

}
