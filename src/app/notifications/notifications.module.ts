import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationPopupComponent } from './notification-popup/notification-popup.component';



@NgModule({
  declarations: [NotificationPopupComponent],
  imports: [
    CommonModule
  ],
  exports:[NotificationPopupComponent]
})
export class NotificationsModule { }
