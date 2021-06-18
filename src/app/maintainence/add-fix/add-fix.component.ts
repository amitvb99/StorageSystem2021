import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, state } from '@angular/animations';
import { AccountsService } from 'src/app/users/accounts.service';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-fix',
  templateUrl: './add-fix.component.html',
  styleUrls: ['./add-fix.component.css'],
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
export class AddFixComponent implements OnInit {

  @Input() maintainer: any; 
  @Input() instrument: any; 
  @Input() show_functions: any;
  @Input() global_cfg: any = {};
  
  add_fix_is_open = false
  constructor(private route: ActivatedRoute, private http: HttpClient, private accounts:AccountsService, private crud:CrudService, private router:Router) { }
  open(){
    this.add_fix_is_open = ! this.add_fix_is_open
  }

  fix(){
    const fix = {
      maintainer:    this.maintainer._id,
      instrument: this.instrument._id,
      user:       this.accounts.get_user_id(),
      notes:      ''      
    }
    this.crud.fix_instrument(fix).subscribe(
      res => {
        res.subscribe( res => {
          res.maintainer_name = res['maintainer']['maintainerName']
          res.maintainer_phone = res['maintainer']['maintainerPhone']
          res.maintainer_address = res['maintainer']['maintainerAddress']
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
        },
        res => {
            if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
        })
      },
      res => {
          if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
      })
    this.add_fix_is_open = ! this.add_fix_is_open
    this.show_functions['fix']()
  }

  remove_field(field){
    if (field == "maintainer") {
      this.maintainer = undefined
    } else {
      this.instrument = undefined
    }
  }

  add_field(field){
    this.show_functions[field]()
  }

  export(){
    alert('exporting...')
    let url = `${environment.apiUrl}/api/user/imports/table/fixes/${this.global_cfg['get_filter_bar']()}`
    let headers = this.crud.get_headers()
    headers['responseType'] = "blob"
    this.http.get(url, headers)
              .toPromise()
              .then(blob => {
                  saveAs(blob, `maintainers.csv`); 
              })
              .catch(err => console.error("download error = ", err))

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        if (params['maintainer_id'] != undefined) {
            console.log(`maintainer id is ${params['maintainer_id']}`);
            this.crud.read('maintainers', params['maintainer_id']).subscribe(
                res => {
                  this.maintainer = res['maintainer'];
                  if (! this.add_fix_is_open) {
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
                  if (! this.add_fix_is_open) {
                    this.open()
                  }
               }
              )
        }
        
      },
      res => {
          if (res.error != undefined && res.error.message != undefined){
            alert(JSON.stringify(res.error.message))  
        }

        if (res.status == 401){
            this.router.navigateByUrl('login')
        }
      });
  }

}
