import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-example',
  templateUrl: './table-example.component.html',
  styleUrls: ['./table-example.component.css']
})
export class TableExampleComponent implements OnInit {
  table_1  = {
    indexing_enabled :true,
    columns_count:4,
    columns:['item','availability','qty','price'],
    headers:{
      'item':'Item',
      'availability':'Ava',
      'qty':'Quantity',
      'price':'Price',
    },
    actions:['remove','edit','show'],
    actions_metadata:{
      'remove':{
        icon:'fas fa-trash-alt',
        condition:{
            'availability':[0]
        }
      },
      'edit':{
        icon:'fas fa-cog',
        condition:{
          
        }
      },
      'show':{
        icon:'fas fa-eye',
        condition:{

        }
    }
    },
    filter_bar_array:['availability','qty'],
    filter_by:{
      'availability':[0,1],
      'qty':[0,1,2],
    }

  }
  constructor() { }

  ngOnInit(): void {
  }

}
