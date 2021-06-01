import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsPageComponent } from './imports-page/imports-page.component';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ImportsPageComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule
  ]
})
export class ImportsModule { 

}
