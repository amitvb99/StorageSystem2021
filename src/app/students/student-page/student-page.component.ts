import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.css']
})
export class StudentPageComponent implements OnInit {
  id: string = '0'
  student = {}
  constructor(private route: ActivatedRoute, private crud: CrudService) { }

  instrument_overrider = (functions, table_metadata) => {
    table_metadata.actions = []
    table_metadata.actions_metadata = {}
    table_metadata.add_button_enabled = false;
    table_metadata.indexing_enabled = false;
    table_metadata.discrete_filter_bar = false;
    table_metadata.free_text_filter_bar = false;

    var res = [{}, table_metadata]
    return res
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('students', this.id).subscribe(
        res => {
          this.student = res;
          console.log(res);
        }
      )
    }) 
  }
}



