import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, state } from '@angular/animations';
import { AccountsService } from 'src/app/users/accounts.service';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';


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
  @Input() global_cfg: any = {};

  add_loan_is_open = false
  constructor(private route: ActivatedRoute, private http: HttpClient, private accounts:AccountsService, private crud:CrudService) { }
  open(){
    this.add_loan_is_open = ! this.add_loan_is_open
  }

  loan(){
    const loan = {
      student:    this.student._id,
      instrument: this.instrument._id,
      user:       this.accounts.get_user_id(),
      notes:      ''      
    }
    this.crud.loan_instrument(loan).subscribe(
      res => {
        res.subscribe( res => {
          console.log(res)
          res.student_name = res['student']['fName']
          res.student_school = res['student']['school']
          res.student_class = res['student']['class']
          res.student_class = res['student']['class']
          res.openning_user = res['openUser']['name']
          res.instrument = res['instrument']['generalSerialNumber']

          if (res['closeUser'] != undefined)
             res.closing_user = res['closeUser']['name']
          else {
            res.closing_user = ''
          }

          if (res.closing_user == '') res.closing_user = 'X'
          if (res.to == '') res.to = 'X'
          if (res.notes == '') res.notes = 'X' 

          if (this.global_cfg['genericTable.add_to_table'] != undefined) {
            this.global_cfg['genericTable.add_to_table'](res)
          }
        })
      }
    )
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

  export(){
    alert('exporting...')
    let url = `${environment.apiUrl}/api/user/imports/table/loans/${this.global_cfg['get_filter_bar']()}`
    let headers = this.crud.get_headers()
    headers['responseType'] = "blob"
    this.http.get(url, headers)
              .toPromise()
              .then(blob => {
                  saveAs(blob, `loans.csv`); 
              })
              .catch(err => console.error("download error = ", err))

  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        if (params['student_id'] != undefined) {
            console.log(`student id is ${params['student_id']}`);
            this.crud.read('students', params['student_id']).subscribe(
                res => {
                  this.student = res['student'];
                  if (! this.add_loan_is_open) {
                    this.open()
                  }
               }
              )
        }

        if (params['instrument_id'] != undefined) {
            console.log(`instrument id is ${params['instrument_id']}`);
            this.crud.read('instruments', params['instrument_id']).subscribe(
                res => {
                  this.instrument = res['instrument'];
                  if (! this.add_loan_is_open) {
                    this.open()
                  }
               }
              )
        }
        
      });
  }

}
