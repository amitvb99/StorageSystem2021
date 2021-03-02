import { Component, OnInit, Input } from '@angular/core';
import { test_t, RunTestsService } from '../run-tests.service';

@Component({
  selector: 'app-tests-layout',
  templateUrl: './tests-layout.component.html',
  styleUrls: ['./tests-layout.component.css']
})
export class TestsLayoutComponent implements OnInit {

  @Input() tests: test_t[]; 

  constructor(private runner:RunTestsService) { }

  ngOnInit(): void {
  }
  
  run_test(i){
    
    this.runner.run_test(this.tests[i].steps, {'pass':()=>{
      this.tests[i].status = 2
    }
  })

  }

}
