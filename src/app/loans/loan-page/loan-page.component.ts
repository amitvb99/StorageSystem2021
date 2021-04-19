import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/shared-services/crud.service';

@Component({
  selector: 'app-loan-page',
  templateUrl: './loan-page.component.html',
  styleUrls: ['./loan-page.component.css']
})
export class LoanPageComponent implements OnInit {
  id: string = '0'
  loan: string;
  student: any;
  instrument: any;
  openning_user: any;
  closing_user: any;
  
  constructor(private route: ActivatedRoute, private crud: CrudService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.crud.read('loans', this.id).subscribe(res => {
        console.log(res)
        this.loan = res
        this.student = res['student']
        this.instrument = res['instrument']
        this.openning_user = res['openUser']
        this.closing_user = res['closeUser']
      })
    })
  }

}
