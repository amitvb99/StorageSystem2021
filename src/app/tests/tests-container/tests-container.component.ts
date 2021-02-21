import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tests-container',
  templateUrl: './tests-container.component.html',
  styleUrls: ['./tests-container.component.css']
})
export class TestsContainerComponent implements OnInit {

  constructor() { }

  show_users_test = false
  show_crud_test = false
  show_filter_test = false
  show_loans_test = false
  
  update_tests(test_id) {
    this.show_users_test = false
    this.show_crud_test = false
    this.show_filter_test = false
    this.show_loans_test = false
    
    if (test_id == 1) {
      this.show_users_test = true
    } else if (test_id == 2) {
      this.show_crud_test = true
    } else if (test_id == 3) {
      this.show_filter_test = true
    } else if (test_id == 4) {
      this.show_loans_test = true
    }
  }
  ngOnInit(): void {
  }

}
