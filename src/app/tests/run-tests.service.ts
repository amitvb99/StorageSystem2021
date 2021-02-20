import { Injectable } from '@angular/core';

export interface test_t {
  step: (_1, _2, _3)=>void,
  description:string,
  status: number
}

@Injectable({
  providedIn: 'root'
})

export class RunTestsService {

  run_test(test, data){
    test[0].step(data, test, 1)
  }
  constructor() { }
}
