import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, state } from '@angular/animations';

@Component({
  selector: 'app-add-loan',
  templateUrl: './add-loan.component.html',
  styleUrls: ['./add-loan.component.css'],
  animations: [
    trigger('openClose',[
      state('opened', style({
        'height': '30%',
        'opacity': 1,
      })),
      state('closed', style({
        'height': '0%',
        'opacity': 0,
      })),
      transition("opened => closed",[
        animate('0.35s')
      ]),
      transition("closed => opened",[
        animate('0.35s')
      ]),
        
    ])
  ]
})



export class AddLoanComponent implements OnInit {

  @Input() student: any; 
  @Input() instrument: any; 
  @Input() show_functions: any;

  add_loan_is_open = false
  constructor() { }
  open(){
    this.add_loan_is_open = ! this.add_loan_is_open
  }

  loan(){
    this.add_loan_is_open = ! this.add_loan_is_open
    this.show_functions['loan']()
  }

  remove_field(field){
    if (field == "student") {
      this.student = undefined
    } else {
      this.instrument = undefined
    }
  }

  add_field(field){
    this.show_functions[field]()
    // if (field == "student") {
    //   this.student = {
    //     'name': 'baraa',
    //     'school': 'Ibn Sena',
    //     'level': '3',
    //     'class': '7',
    //   }
    // } else {
    //   this.instrument = {
    //     'type': 'A',
    //     'subtype': 'A1',
    //     'style': 's1',
    //     'id': '0365982455'
    //   }
    // }
  }
  ngOnInit(): void {
  }

}
