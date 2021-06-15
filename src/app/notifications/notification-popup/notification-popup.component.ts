import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared-services/crud.service';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit {

  toggleText = "Hide";
  show = false;
  nof_notifications = 0;
  nof_new_notifications = 0;
  

  notifications:any = [ ]

  update_nof_new_notifications(){
    var x = 0;
    this.notifications.forEach(element => {
      x += element.seenStatus ? 0 : 1;
    });
    this.nof_new_notifications = x;
    this.nof_notifications = this.notifications.length;
    
  }
  see_notification(i, event){
    if(event.target instanceof HTMLDivElement) {
      this.crud.see_notification(i).subscribe(res => {
        this.crud.read_notifications().subscribe(res => {
          this.notifications = res['data'];
          this.update_nof_new_notifications()
        })
      })
    }
    

  }

  delete_notification(i, event){
    if(event.target instanceof HTMLElement) {
      this.crud.delete_notification(i).subscribe(res => {
        this.crud.read_notifications().subscribe(res => {
          this.notifications = res['data'];
          this.update_nof_new_notifications()
        })
      })
    }
  }

  onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? "Hidе" : "Show";
  }

  constructor(private crud: CrudService) { }
 
  ngOnInit(): void {
    this.crud.read_notifications().subscribe(res => {
        console.log(this.notifications)
      this.notifications = res['data'];
      this.update_nof_new_notifications()

    })
    this.update_nof_new_notifications()

  }

}
