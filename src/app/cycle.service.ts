import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as Constants from './constants';
// Cycle
// checkpoints

interface ICheckpoint {
   date: string;
   time: string;
   getTime: number;
   currentCheckPoint: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CycleService {

  constructor() { }

   getCheckpoints(cycle = this.getCycle(), utc = false): any[] {

      var lock = false;
      var now = new Date();
      var then = new Date();
      then.setTime(Constants.EPOCH + (cycle * Constants.CYCLE_LENGTH));
      this.addCheckPoint(then);
      // then.setTime(this.nextCheckPointInMS(then)); // No measurement is taken until the first checkpoint after rollover.
      // var year: number = parseInt(this.formatDate(start, 'YYYY'));
      // var cycleDisplay = cycle + 1;
      

      
      var checkpoints = [];
      for (var i=0; i < 35; i++) {

            checkpoints[i] = {
               date: this.formatDate(then, Constants.DATE_FORMAT) + (utc ? ' UTC' : ''),
               time: this.formatDate(then, Constants.TIME_FORMAT),
               getTime: then.getTime(),
               currentCheckPoint: this.isCurrentCheckPoint(now, then)
            };

            this.addCheckPoint(then);
           


      }
      return checkpoints;
   }

   isCurrentCheckPoint(now: Date, then: Date) {
      if(now.getTime() > then.getTime() && now.getTime() < then.getTime() + Constants.CHECKPOINT_LENGTH) {
         return true;
      }
      return false
   }

   addCheckPoint(date: Date) {
      date.setTime(date.getTime() + Constants.CHECKPOINT_LENGTH);
   }



   // returns Date with Start of current Cycle
   // if cycle is empty it returns current cycle start date
   getCycleStartDate(cycle = this.getCycle()): Date {
      var now = new Date();
      now.setTime(Constants.EPOCH + (cycle * Constants.CYCLE_LENGTH));
      return now;
   }

   // Based on the first Cycle in ingress (2014)
   // if Date is empty it returns current
   getCycle(date = new Date()): number {
      return Math.floor((date.getTime() - Constants.EPOCH) / Constants.CYCLE_LENGTH);
   }

   // HELPER
   formatDate(date: Date, format: string, utc = false): string {
      if (utc) {
         return moment(date).utc().format(format);
      }
      return moment(date).locale('de').format(format);
   }
}
