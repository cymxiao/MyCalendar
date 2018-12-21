import { calendarEvent } from './../event.model';
import { CalendarEventService } from './../singleton.service';
import { NavController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import * as Moment from 'moment';
import { format } from 'url';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  date = new Date();
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  currentMonth = '';
  currentYear = 0;
  currentDate = 0;

  eventList: any;
  selectedEvent: any;
  isSelected: any;
  eventSubscribe: any;
  off: number;

  constructor(public navController: NavController,
    public alertCtrl: AlertController,
    public calEvent: CalendarEventService,
    private route: ActivatedRoute) {

    this.off = new Date().getTimezoneOffset() / 60 as number;
    this.calEvent.event = new Array;
    console.log(`current date: ${this.date}`);
  }
  ngOnInit() {
    this.loadEventThisMonth();
    this.getDaysOfMonth()
  }
  ngOnChanges() {
    console.log("Page Changed");
  }
  ngOnDestroy() {
    this.eventSubscribe.unsubscribe();
  }
  newEventAdded() {
    //event from event added page
    console.log(`New event added`);
    this.getDaysOfMonth();
  }
  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i + 1);
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    //var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
    for (var i = 0; i < (6 - lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i + 1);
    }
    var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }
  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }
  goToNextMonth() {
    console.log(`The next date`)
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }
  addEvent() {
    let data: string;
    this.navController.navigateForward('AddEvent')
  }
  loadEventThisMonth() {
    this.eventList = new Array();
    this.eventSubscribe = this.calEvent.getEvents().subscribe((data) => { this.eventList = data });
    console.log(`events in list: ${JSON.stringify(this.eventList)}`);
  }
  checkEvent(day): boolean {
    //called by HTML for each item...to produce a bullet
    var hasEvent = false;   
    var dateNow = Moment().toISOString() as string;
    this.calEvent.event.forEach((event: calendarEvent) => {
      //console.log(`event.startDate: ${event.startDate }, Moment(event.startDate).date(): ${Moment(event.startDate).date()}`)
      //console.log(`event.endDate: ${event.endDate}, Moment(event.endDate).date(): ${Moment(event.endDate).date()}`)
      if ((Moment(event.startDate).date() === day) || (Moment(event.endDate).date() === day)) {
        hasEvent = true;
      }
    });
    return hasEvent;
  }
  selectDate(day) {
    console.log(`Selected Day: ${day}`);
    this.isSelected = false;
    this.selectedEvent = new Array();
    this.eventList.forEach((element: calendarEvent) => {
      console.log(`Event: ${JSON.stringify(element)}`);
      console.log(`element.startDate:${this.getDay(element.startDate)}`)
      if (Moment(element.startDate).date() === day || Moment(element.endDate).date() === day) {
        console.log('Selected Date ')
        this.isSelected = true;
        console.log('IsSelected = true');
        this.selectedEvent.push(element);
      }
    });
  }
  getDay(dte: string): number{
    if (dte) {
      return new Date(dte).getDay()
    } else {
      return -1;
    }
  }
swipeEvent(e) {
  switch (e.direction) {
    case 2:
      //swipe left
      this.goToNextMonth();
      break;
    case 4:
      //swipe right      
      this.goToLastMonth();
  }
}
async deleteEvent(evt) { 
  let alert = await this.alertCtrl.create({
    header: 'Confirm Delete',
    message: 'Are you sure want to delete this event?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Ok',
        handler: () => {
          this.calEvent.deleteEvent(evt.id);
          this.selectDate(new Date(evt.startDate.replace(/\s/, 'T')).getDate());
        }

      }
    ]
  });
  alert.present();
}
  eventClicked(se:calendarEvent) {
    console.log(`event clicked: ${se.title}`);
  }
}
