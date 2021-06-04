import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-instrument-page',
  templateUrl: './instrument-page.component.html',
  styleUrls: ['./instrument-page.component.css']
})
export class InstrumentPageComponent implements OnInit {
  id: string = '0'
  instrument = {}
  history = []
  history_table_metadata = {
    component_name: "instruments",
    indexing_enabled : true,
    add_button_enabled: false,
    discrete_filter_bar: false,
    free_text_filter_bar: false,
    export_button_enabled: false,
    columns_count:3,
    columns:['date', 'status', 'user'],
    headers:{
      'date':'Date',
      'status':'Status',
      'user':'User',
    }, 
    actions:['show'],
    actions_metadata:{
      'show':{
        icon:'fas fa-eye',
        condition:{ 
          'status': ['new', 'available', 'broken', 'maintained', 'back from maintainance', 'unusable', 'deleted', 'missing']
        }
      }
    },
    filter_bar_array:[],
    filter_by:{}

  }

  data = [
    {'date':'Date', 'status':'available', 'user':'User',},
    {'date':'Date', 'status':'maintained', 'user':'User',},
    {'date':'Date', 'status':'loaned', 'user':'User',},
    {'date':'Date', 'status':'available', 'user':'User',},
    {'date':'Date', 'status':'maintained', 'user':'User',},
    {'date':'Date', 'status':'loaned', 'user':'User',},
    {'date':'Date', 'status':'available', 'user':'User',},
]
  constructor(private http:HttpClient, private route: ActivatedRoute, private crud: CrudService) { }

  export() {
    alert('exporting')
    let url = `${environment.apiUrl}/api/user/imports/instruments/:${this.id}`
    this.http.get(url, {responseType: "blob"})
              .toPromise()
              .then(blob => {
                  saveAs(blob, `instrument_${this.id}.gz`); 
              })
              .catch(err => console.error("download error = ", err))
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('instruments', this.id).subscribe(
        res => {
          console.log(res)
          this.instrument = res['instrument'];
          for (let i = 0; i < res['history'].length; i++) {
            res['history'][i]['user-data'] = res['history'][i]['user']
            res['history'][i]['user'] = res['history'][i]['user-data']['name']
            
            this.history.push(res['history'][res['history'].length - 1 - i])
          }
          return
       }
      )
    }) 
  }

}
