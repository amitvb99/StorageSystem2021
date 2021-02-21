import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../backend-api.service';
import { bindCallback } from 'rxjs';
import { RunTestsService, test_t } from '../run-tests.service';

@Component({
  selector: 'app-crud-test',
  templateUrl: './crud-test.component.html',
  styleUrls: ['./crud-test.component.css']
})
export class CrudTestComponent implements OnInit {
  tests: test_t[][] = [
    /*
    ##################### Test 1 #####################
     */
    [
      {
        step: this.api.login('salehma', '123'),
        description: 'step 1: login (username: "salehma", password: "123")',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {console.log('hehehe');cont[next_step_idx-1].status = 1},
        description: 'validate username is mahmoud',
        status:0
      },
    ]
  ]
  constructor(private api:BackendApiService, private runner:RunTestsService) { }
  test1() {

    this.runner.run_test(this.tests[0], {})
  }
  ngOnInit(): void {
  }

}
