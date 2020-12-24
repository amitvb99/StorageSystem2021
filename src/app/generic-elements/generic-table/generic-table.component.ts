import { Component, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { trigger, transition, style, animate, state, query, stagger, keyframes } from '@angular/animations';
import { CrudService } from 'src/app/shared-services/crud.service';

interface actions_metadata_t{
  icon: string,
  condition: Record<string,(number | string)[]>
}
interface meta_data_t {
  component_name: string,
  indexing_enabled: boolean,
  columns_count: number,
  columns: string[],
  headers: Record<string,string>,
  actions: string[],
  actions_metadata: Record<string,actions_metadata_t>
  filter_bar_array: string[],
  filter_by: Record<string,(number | string)[]>
} 

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css'],
  animations:[
    // trigger('highlight',[
    //   transition("* => highlighted",[])

    // ]),
    

    trigger('fade',[

      transition("* => *",[
        query(':enter',
          [style({opacity:0,'line-height':'0%'}),
             stagger('50ms',animate('300ms ease-in'))] 
        ,{ optional: true }),

        query(':leave',
        [stagger('10ms',animate('200ms linear')),style({opacity:0,'line-height':'0%'})] 
      ,{ optional: true })

      ])

    ])
  ]
})


export  class TableComponent implements OnInit {


  @Input() meta_data: meta_data_t; 
  @Input() functions: any; 

  module_variables = {
    filter_bar_values:undefined,
    local_db: new Map(),
    data_to_show:[]
}

  index = 0
  constructor(private crud:CrudService) { }



  should_hide(datum : any,action : any){
    let cond = this.meta_data.actions_metadata[action].condition
    let keys = Object.keys(cond)
    for(let i = 0; i < keys.length; i++){
      let key = keys[i]
      if (cond[key].includes(datum[key]))
        return true
    }
    return false
  }
  getClass(datum,action){
    let Myclass = this.meta_data.actions_metadata[action].icon
    if (this.should_hide(datum,action))
      return Myclass + ' hide_element'
    else 
      return Myclass
  }

  get_filter_options(filter){
    var res = []
    let options =  this.meta_data.filter_by[filter]

    res.push(filter)
    for ( let i = 0 ; i < options.length; i++)
       res.push(options[i])

    return res
  }

filter_bar_changed(){
  let filter_bar = this.module_variables['filter_bar_values'].join("_")
  if (this.module_variables['local_db'].get(filter_bar) === undefined){
    //make_http_request
    this.module_variables['data_to_show'] = []
  } else {
    this.module_variables['data_to_show'] = this.module_variables['local_db'].get(filter_bar)
  }
}
  ngOnInit(): void {
    this.module_variables.filter_bar_values = Object.assign([], this.meta_data.filter_bar_array) 
    this.crud.read(this.meta_data.component_name).subscribe(function(data){
      this.module_variables['local_db'].set(this.meta_data.filter_bar_array.join("_"),data);
      this.module_variables['data_to_show'] = this.module_variables['local_db'].get(this.meta_data.filter_bar_array.join("_"));
  }.bind(this)
    )
    
  }

}
