import { Component, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { trigger, transition, style, animate, state, query, stagger, keyframes } from '@angular/animations';
import { CrudService } from 'src/app/shared-services/crud.service';
import { filter } from 'rxjs/operators';
// import { ConsoleReporter } from 'jasmine';

interface actions_metadata_t{
  icon: string,
  condition: Record<string,(number | string)[]>
}
interface meta_data_t {
  component_name: string,
  indexing_enabled: boolean,
  add_button_enabled: boolean,
  discrete_filter_bar: boolean,
  free_text_filter_bar: boolean,
  columns_count: number,
  columns: string[],
  headers: Record<string,string>,
  actions: string[],
  actions_metadata: Record<string,actions_metadata_t>
  filter_bar_array: string[],
  filter_by: Record<string,(number | string)[] | Record<string | number,(number | string)[]>>
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
  @Input() data: any; 
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
    if (Array.isArray(options)) {
      for ( let i = 0 ; i < options.length; i++)
        res.push(options[i])
    } else {
      const parent_field = Object.keys(options)[0]
      const parent_field_idx = this.meta_data.filter_bar_array.indexOf(parent_field)
      const parent_field_value = this.module_variables['filter_bar_values'][parent_field_idx]
      var current_options = null;

      if (parent_field_value == parent_field){
        
        current_options = []
        for ( let i = 0 ; i < Object.keys(options[parent_field]).length; i++) {
          for ( let j = 0 ; j < options[parent_field][Object.keys(options[parent_field])[i]].length; j++) {
            res.push(options[parent_field][Object.keys(options[parent_field])[i]][j])
          }    
        }
        
      } else {
        current_options = options[parent_field][parent_field_value]
      }
      for ( let i = 0 ; i < current_options.length; i++)
        res.push(current_options[i])
    }

    return res
  }

filter_bar_changed(){
  let filter_bar: string = this.module_variables['filter_bar_values'].join("_")
  let _filter_bar: string[] = new Array<string>(filter_bar.length - filter_bar.split(" ").length + 1);
  var i: number = 0, j: number = 0
  for (; i < filter_bar.length; i++, j++) {
    if (filter_bar[i] == ' ') {
      _filter_bar[j] = filter_bar[i+1].toUpperCase()
      i = i + 1
    } else {
      _filter_bar[j] = filter_bar[i]
    }
  }
  filter_bar = _filter_bar.join('')
  console.log(filter_bar)
  
  for ( let j = 0 ; j < this.meta_data.filter_bar_array.length; j++) {
    const option = this.meta_data.filter_bar_array[j]
    const option_value = this.module_variables['filter_bar_values'][j]
    if (this.get_filter_options(option).indexOf(option_value) == -1){
      this.module_variables['filter_bar_values'][j] = option
    }  
  } 

  if (this.module_variables['local_db'].get(filter_bar) === undefined){
    this.crud.filtered_read(this.meta_data.component_name, filter_bar).subscribe(res => {
      console.log(`res is ${res}`)
      this.module_variables['data_to_show'] = res
    })
    
  } else {
    this.module_variables['data_to_show'] = this.module_variables['local_db'].get(filter_bar)
  }
}
  ngOnInit(): void {
    this.module_variables.filter_bar_values = Object.assign([], this.meta_data.filter_bar_array) 
    if (this.data == undefined || this.data == 'undefined') {
      this.crud.read(this.meta_data.component_name).subscribe(function(data){
          console.log(data)
          this.module_variables['local_db'].set(this.meta_data.filter_bar_array.join("_"),data);
          this.module_variables['data_to_show'] = this.module_variables['local_db'].get(this.meta_data.filter_bar_array.join("_"));
        }.bind(this)
      )
    } else {
      this.module_variables['local_db'].set(this.meta_data.filter_bar_array.join("_"),this.data);
      this.module_variables['data_to_show'] = this.module_variables['local_db'].get(this.meta_data.filter_bar_array.join("_"));
    }
  }

}
