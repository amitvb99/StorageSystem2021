import { Component, OnInit } from '@angular/core';
import { BackendApiService, student_t } from '../backend-api.service';
import { bindCallback } from 'rxjs';
import { RunTestsService, step_t, test_t } from '../run-tests.service';

@Component({
  selector: 'app-crud-test',
  templateUrl: './crud-test.component.html',
  styleUrls: ['./crud-test.component.css']
})
export class CrudTestComponent implements OnInit {
  s1: student_t = {
    fName: 'Baraa',
    lName: 'Natour',
    school: 'BGU',
    grade: '10',
    class: '11',
    parent1Name: 'Ali',
    parent2Name: 'Sana',
    parent1PhoneNumber: '0502211612',
    parent2PhoneNumber: '0528523321',
    parent1Email: 'idk@gmail.com',
    parent2Email: 'no_email@gmail.com',
    instruments: '-'
  }

  s2: student_t = {
    fName: 'Mahmoud',
    lName: 'Saleh',
    school: 'BGU',
    grade: '10',
    class: '11',
    parent1Name: 'idk',
    parent2Name: 'idk',
    parent1PhoneNumber: 'idk',
    parent2PhoneNumber: 'idk',
    parent1Email: '-',
    parent2Email: '-',
    instruments: '-'
  }

  s3: student_t = {
    fName: 'Sunders',
    lName: 'Bruskin',
    school: 'BGU',
    grade: '10',
    class: '11',
    parent1Name: 'idk',
    parent2Name: 'idk',
    parent1PhoneNumber: 'idk',
    parent2PhoneNumber: 'idk',
    parent1Email: '-',
    parent2Email: '-',
    instruments: '-'
  }

  add_student = {
    name: 'add student',
    steps: [
      {
        step: this.api.clear(),
        description: 'Clear db',
        status:0
      },
      {
        step: this.api.login_admin(),
        description: 'login as admin',
        status:0
      },
      {
        step: this.api.add_student(this.s1),
        description: 'send add request to server',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {console.log(data['result']);data['id'] = data['result'].id; cont[next_step_idx-1].status = 2},
        description: 'validate result is as expected',
        status:0
      },
      {
        step: this.api.get_student_by_id('id'),
        description: 'get student by id',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {
          if (data['student'].fName != this.s1.fName)
            cont[next_step_idx-1].status = 1
          else
            cont[next_step_idx-1].status = 1
        },
        description: 'validate data retreived from server',
        status:0
      },
      {
        step: this.api.pass(),
        description: '',
        status:0
      },
    ],
    status: 0,
    openned: false
  }
  
  update_student = {  
    name: 'update student test',
    steps: [
      {
        step: this.api.clear(),
        description: 'Clear db',
        status:0
      },
      {
        step: this.api.login_admin(),
        description: 'login as admin',
        status:0
      },
      {
        step: this.api.add_student(this.s1),
        description: 'send add request to server',
        status:0
      },
      {
        step: this.api.get_student_by_id('id'),
        description: 'get student by id',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {
          if (data['student'].fName != this.s1.fName){
            cont[next_step_idx-1].status = 1
          } else {
            cont[next_step_idx-1].status = 1
            data['id'] = data['student'].id
            cont[next_step_idx-1].status = 2
            cont[next_step_idx].step(data, cont, next_step_idx+1) 
          }
        },
        description: 'validate data retreived from server',
        status:0
      },
      {
        step: this.api.update_student(this.s2),
        description: 'update student',
        status:0
      },
      {
        step: this.api.get_student_by_id('id'),
        description: 'get student by id',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {
          if (data['student'].fName != this.s2.fName)
            cont[next_step_idx-1].status = 1
          else
            cont[next_step_idx-1].status = 2
        },
        description: 'validate data changed',
        status:0
      },
      {
        step: this.api.pass(),
        description: '',
        status:0
      },

    ], 
    status: 0,
    openned: false
  }
  get_students = {  
    name: 'get all students test',
    steps: [
      {
        step: this.api.clear(),
        description: 'Clear db',
        status:0
      },
      {
        step: this.api.login_admin(),
        description: 'login as admin',
        status:0
      },
      {
        step: this.api.add_students([this.s1, this.s2, this.s3]),
        description: 'add three students',
        status:0
      },
      {
        step: this.api.get_students(),
        description: 'get students',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {
          if (data['students'].length != 3 || data['students'][0].fname != 'Baraa' || data['students'][1].fname != 'Mahmoud' || data['students'][2].fname != 'Sunders'){
            cont[next_step_idx-1].status = 1
          } else {
            cont[next_step_idx-1].status = 2
            cont[next_step_idx].step(data, cont, next_step_idx+1) 
          }
        },
        description: 'validate you get all students',
        status:0
      },
      {
        step: this.api.pass(),
        description: '',
        status:0
      },
    ], 
    status: 0,
    openned: false
  }
  delete_student = {
    name: 'delete student test',
    steps: [
      {
        step: this.api.clear(),
        description: 'Clear db',
        status:0
      },
      {
        step: this.api.login_admin(),
        description: 'login as admin',
        status:0
      },
      {
        step: this.api.add_student(this.s1),
        description: 'add  student',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {
          if (data['student'].fName != this.s1.fName){
            cont[next_step_idx-1].status = 1
          } else {
            data['id'] = data['student'].id
            cont[next_step_idx-1].status = 2
            cont[next_step_idx].step(data, cont, next_step_idx+1) 
          }
        },
        description: 'validate student added',
        status:0
      },
      {
        step: this.api.delete_student(),
        description: 'delete  student',
        status:0
      },
      {
        step: this.api.get_student_by_id(),
        description: 'get student by id',
        status:0
      },
      {
        step: (data, cont, next_step_idx)=> {
          if (data['student']){ // validate student is not here
            cont[next_step_idx-1].status = 2
            cont[next_step_idx].step(data, cont, next_step_idx+1) 
          } else {
            data['id'] = data['student'].id
            cont[next_step_idx-1].status = 1
          }
        },
        description: 'validate student added',
        status:0
      },
      {
        step: this.api.pass(),
        description: '',
        status:0
      },
      
    ], 
    status: 0,
    openned: false
  }

  add_instrument = {  
    name: '',
    steps: [], 
    status: 0,
    openned: false
  }
  update_instrument = {  
    name: '',
    steps: [], 
    status: 0,
    openned: false
  }
  get_instruments = {  
    name: '',
    steps: [], 
    status: 0,
    openned: false
  }
  delete_instrument = {  
    name: '',
    steps: [], 
    status: 0,
    openned: false
  }

  get_users = {  
    name: '',
    steps: [], 
    status: 0,
    openned: false
  }
  delete_user = {  
    name: '',
    steps: [], 
    status: 0,
    openned: false
  } 

  tests: test_t[] = [
    this.add_student,
    this.update_student,
    this.get_students,
    this.delete_student,

    this.add_instrument,
    this.update_instrument,
    this.get_instruments,
    this.delete_instrument,

    this.get_users,
    this.delete_user, 
  ]
  
  constructor(private api:BackendApiService, private runner:RunTestsService) { }
  run_test1() {

    this.runner.run_test(this.tests[0].steps, {})
  }
  ngOnInit(): void {
  }
  
  open_test_details(i){

  }

}
