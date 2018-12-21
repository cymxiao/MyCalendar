import { calendarEvent } from './event.model';
import { Injectable } from '@angular/core';
//import 'rxjs/add/observable/of';
import { Observable,of } from 'rxjs';
import * as Moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class CalendarEventService {
    public event: calendarEvent [] = [];
    
    public  getUid():string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }//
    public addEvent(calEvent: calendarEvent):void {
        this.event.push(calEvent);
    }
    public deleteEvent(calEvent: calendarEvent):void {
        let index = this.event.findIndex((ev) => { return ev.id === calEvent.id; });
        if (index > -1) {
            this.event.splice(index, 1);
        }
    }
    public getEvents(): Observable<calendarEvent[]>{
        let off = new Date().getTimezoneOffset() / 60 as number;
        let eve = {} as calendarEvent;
        //eve.startDate = Moment().subtract(off, 'h').toISOString();
        eve.startDate = Moment().add(1,'d').toISOString();
        eve.endDate = Moment(eve.startDate).add(1, 'h').toISOString();
        eve.title = "New Event";
        eve.isAllDay = false;
        eve.message = "Event Message";
        eve.id = '11111';
        this.addEvent(eve);
        let eve2 = {} as calendarEvent;
        console.log(`Event1: ${JSON.stringify(eve)}`);
        eve2.startDate = Moment().add(3, 'd').toISOString();
        eve2.endDate = Moment(eve2.startDate).add(1, 'h').toISOString();
        eve2.title = "New Event 3";
        eve.isAllDay = false;
        eve2.message = "Event Message 3";
        eve2.id = '11113';
        this.addEvent(eve2);
        console.log(`Event3: ${JSON.stringify(eve)}`);
        return of(this.event);
    }
}