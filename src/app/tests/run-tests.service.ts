import { Injectable } from '@angular/core';

export interface step_t {
  step: (_1, _2, _3)=>void,
  description:string,
  status: number
}
export interface test_t {
  name: string
  steps: step_t[],
  status: number,
  openned
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
