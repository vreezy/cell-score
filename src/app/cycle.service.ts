import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as Constants from './constants';
import { environment } from '../environments/environment';
import { ICheckpoint } from './ICheckpoint';
// Cycle
// checkpoints



@Injectable({
  providedIn: 'root'
})

export class CycleService {

   constructor() { }
   public getNextCheckpointDate(currentcp = this.getCurrentCheckpoint()): Date {
      const date = new Date();
      date.setTime(currentcp.date.getTime() + Constants.CHECKPOINT_LENGTH);
      return date;

   }

   public getCurrentCheckpoint(checkpoints = this.getCheckpoints()): ICheckpoint {
      const now = new Date();
      for (var i = 0; i < checkpoints.length; i++) {
         if(this.isCurrentCheckPoint(now, checkpoints[i].date)) {
            return checkpoints[i];
         }
      }

      return {
         cp: 0,
         localeDate: "error",
         localeTime: "error",
         date: new Date()
      };
   }

   public getCheckpoints(cycle = this.getCycle(), utc = false): ICheckpoint[] {

      var date = new Date();
      date.setTime(Constants.EPOCH + (cycle * Constants.CYCLE_LENGTH));
      this.addCheckPoint(date);
     
      var checkpoints: ICheckpoint[] = [];
      for (var i = 0; i < 35; i++) {

         const newDate = new Date();
         newDate.setTime(date.getTime());

         checkpoints[i] = {
            cp: i + 1,
            localeDate: date.toLocaleDateString(), // this.formatDate(then, Constants.DATE_FORMAT) + (utc ? ' UTC' : ''),
            localeTime: date.toLocaleTimeString(), // this.formatDate(then, Constants.TIME_FORMAT),
            date: newDate, // clone
            // isCurrent: this.isCurrentCheckPoint(now, then)
         };
         this.addCheckPoint(date);
      }
      if(!environment.production) {
         console.log("cycleService - getCheckpoints");
         console.log(checkpoints);
      }
      
      return checkpoints;
   }

   // Based on the first Cycle in ingress (2014)
   // if Date is empty it returns current
   public getCycle(date = new Date()): number {
      return Math.floor((date.getTime() - Constants.EPOCH) / Constants.CYCLE_LENGTH);
   }

   ////////////////////////   
   // HELPER
   ////////////////////////

   private isCurrentCheckPoint(now: Date, then: Date): boolean {
      if(now.getTime() > then.getTime() && now.getTime() < then.getTime() + Constants.CHECKPOINT_LENGTH) {
         return true;
      }
      return false
   }

   private addCheckPoint(date: Date): void {
      date.setTime(date.getTime() + Constants.CHECKPOINT_LENGTH);
   }

   // returns Date with Start of current Cycle
   // if cycle is empty it returns current cycle start date
   // private getCycleStartDate(cycle = this.getCycle()): Date {
   //    var now = new Date();
   //    now.setTime(Constants.EPOCH + (cycle * Constants.CYCLE_LENGTH));
   //    return now;
   // }

   public getCycleDisplay() {
      const yearStart = new Date();
      yearStart.setDate(1);
      yearStart.setMonth(0);
      yearStart.setHours(0);
      yearStart.setMinutes(0);
      yearStart.setSeconds(0);

      const yearStartCycle = this.getCycle(yearStart);
      const currentCycle = this.getCycle()
      return currentCycle - yearStartCycle
      // if (year > 2014) {
      // var yearEnd = new Date(year-1, 11, 31, 23, 59);
      // var lastCycle = Math.floor((yearEnd.getTime() -this.EPOCH) / this.CYCLE_LENGTH);
      // cycleDisplay = cycle - lastCycle;
   }
}
