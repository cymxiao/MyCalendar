import { CalendarEventService } from './../singleton.service';
import { calendarEvent } from './../event.model';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'
import * as Moment from 'moment';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  public dte = new Date() as Date;
  public event = {} as calendarEvent;
  public offSet = new Date().getTimezoneOffset() / 60 as number;

  constructor(private navController: NavController,
    private alertController: AlertController, public event1: Events,
    private route: ActivatedRoute, public calEventService: CalendarEventService) {
    if (this.route.snapshot.paramMap.get('id')) {
      let id = this.route.snapshot.paramMap.get('id');
      this.event = this.calEventService.event[id];
    }
  }

  ngOnInit() {
    this.event.startDate = Moment(this.event.startDate).subtract(this.offSet, 'h').toISOString();
    this.event.endDate = Moment(this.event.startDate).add(1, 'h').toISOString();
    this.event.title = "New Event";
    this.event.message = "Event Message";
    console.log(`tstartdate: ${this.event.startDate}`)
  }
  save() {
    this.calEventService.addEvent(this.event);
    this.navController.navigateBack('calendar');
    this.event1.publish('addEvent');   
  }
}
