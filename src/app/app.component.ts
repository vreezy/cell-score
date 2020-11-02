   import { Component } from '@angular/core';
   import * as moment from 'moment';


   // interface 
   import { IGetRegionScoreDetails } from './IGetRegionScoreDetails';

   const chartOptions = {
      series: [50,50],
      chart: {
         height: 350,
         type: "donut"
      },
      labels: ["RES", "ENL"],
      colors: [
         "#005684", // darkblue
         "#017f01", // darkgreen
         "#00c5ff", // lightblue
         "#03fe03" // lightgreen
      ],
      dataLabels: {
         enabled: true
      },
      legend: {
         show: false,
         position: 'bottom',
      },
      theme: {
         mode: 'dark', 
      }
   };

   const chartOptionsMixedModel = {
   series: [{
      name: 'RES',
      data: []
   }, {
      name: 'ENL',
      data: []
   }],
   chart: {
      height: 350,
      type: 'area'
   },
   colors: [
      "#005684", // darkblue
      "#017f01", // darkgreen
      "#00c5ff", // lightblue
      "#03fe03" // lightgreen
   ],
   dataLabels: {
      enabled: false
   },
   stroke: {
      curve: 'smooth' // 'straight'
   },
   xaxis: {
      // type: 'datetime',
      categories: []
   },
   theme: {
      mode: 'dark', 
   },
   markers: {
      size: 5,
   }
   // tooltip: {
   //    x: {
   //       format: 'dd/MM/yy HH:mm'
   //    },
   }

   @Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
   })
   export class AppComponent {
      //  @ViewChild("chart") chart: ChartComponent;

   loading = true;
   error = false;
   fetchURLS = [
      "https://www.vreezy.de/ingress/cell-score/assets/zone.php",
      "https://www.vreezy.de/ingress/cell-score/assets/zone.php?zone=2",
      "https://www.vreezy.de/ingress/cell-score/assets/zone.php?zone=3"
   ];
   
   response: IGetRegionScoreDetails[] = [];
   chartOptions = [];
   chartOptionsMixed = [];
   index = 0;
   indexZeroValue = "xxx";

   EPOCH = 1389150000000;
   CYCLE_LENGTH = 630000000;
   CHECKPOINT_LENGTH = 18000000;
   cycle = 0;
   currentCycle = 0;
   cycleDisplay = 0;
   year = 0;
   checkpoints = [];
   currentCheckPoint = 0;
   nextCheckPoint = 0;
   UTC = false;

   async ngOnInit() {
      const promises = this.fetchURLS.map((url: string) => {
         return this.getData(url);
      })
      const results = await Promise.all(promises);
            
      if(results.every((result:boolean) => { return result})) {
         this.loading = false;
      } else {
         this.error = true;
      }

      this.sortResponse();
      this.setCycle();
      this.calcCycle();
      this.setNextCheckPoint();
      this.setIndexZeroValue();

      this.refreshAfterCheckPoint()

      
   }

   refreshAfterCheckPoint() {
      const refreshDate = new Date();
      refreshDate.setMinutes( refreshDate.getMinutes() + 3 );

      const refreshMilliSeconds = this.checkpoints[this.nextCheckPoint].getTime - refreshDate.getTime();
      window.setInterval('window.location.reload()', refreshMilliSeconds)
   }

   sortResponse(): void {
      this.response = this.response.sort((a, b) => {
         if(a.result.regionName > b.result.regionName) { return -1; }
         if(a.result.regionName < b.result.regionName) { return 1; }
         return 0;
      });
   }

   getScorePercent(team1: string , team2: string ): string {
      const total: number = parseInt(team1) + parseInt(team2);
      const totalPercent = 100 / total;
      return (totalPercent * parseInt(team1)).toFixed(2).replace('.', ',');
   }

   switchZone(index: number): void {
      if(index + 1 === this.response.length) {
         this.index = 0;
      }
      else {
         this.index = index + 1;
      }
   }

   setIndexZeroValue() {
      if(localStorage.getItem('index')) {
         if(parseInt(localStorage.getItem('index')) < this.response.length) {
            this.index = parseInt(localStorage.getItem('index'));
            this.indexZeroValue = this.response[this.index].result.regionName
         }
         else {
            this.indexZeroValue = this.response[0].result.regionName;
         }
      }
      else {
         this.indexZeroValue = this.response[0].result.regionName;
      }
   }

   setNextCheckPoint(): void {
      if (this.currentCheckPoint + 1 < this.checkpoints.length) {
         this.nextCheckPoint = this.currentCheckPoint + 1;
      }
      else {
         this.nextCheckPoint = this.checkpoints.length - 1;
      }
   }

   setCycle(): void {
      this.cycle = this.currentCycle = Math.floor((new Date().getTime() - this.EPOCH) / this.CYCLE_LENGTH);
   }

   formatDate(date, format) {
      if (this.UTC) {
         return moment(date).utc().format(format);
      }
      return moment(date).locale('de').format(format);
   }

   isNext(start, now) {
      return (start.getTime() > now && (now + this.CHECKPOINT_LENGTH) > start.getTime());
   }

   changeIndex(index: number) {
      this.index = index;
      localStorage.setItem('index', index.toString());
   }

   calcCycle(cycle = this.cycle) {
      var lock = false
      var start = new Date();
      var now = start.getTime();
      var year: number = parseInt(this.formatDate(start, 'YYYY'));
      var cycleDisplay = cycle+1;
      start.setTime(this.EPOCH + (cycle*this.CYCLE_LENGTH));
      year = parseInt(this.formatDate(start, 'YYYY'));
      start.setTime(start.getTime()+this.CHECKPOINT_LENGTH); // No measurement is taken until the first checkpoint after rollover.
      var checkpoints = [];
      for (var i=0;i<35;i++) {
            //   var next = this.isNext(start, now);
              checkpoints[i] = {
                      date: this.formatDate(start, 'dddd D MMM') + (this.UTC ? ' UTC' : ''),
                      time: this.formatDate(start, 'HH:mm'),
                      getTime: start.getTime()
                     //  classes: (next ? 'next' : (start.getTime() < now ? 'past' : 'upcoming')) + (i==34 ? ' final' : ''),
                     //  next: next
              };
               // checkpoints[i] = {
               //    date: this.formatDate(start, 'ddd D MMM') + (this.UTC ? ' UTC' : ''),
               //    time: this.formatDate(start, 'HH:mm'),
               //    classes: (next ? 'next' : (start.getTime() < now ? 'past' : 'upcoming')) + (i==34 ? ' final' : ''),
               //    next: next
               // };
              start.setTime(start.getTime()+this.CHECKPOINT_LENGTH);
            if (now < start.getTime() && !lock) {
               this.currentCheckPoint = i;
               lock = true;
            }

      }
      if (year > 2014) {
              var yearEnd = new Date(year-1, 11, 31, 23, 59);
              var lastCycle = Math.floor((yearEnd.getTime() -this.EPOCH) / this.CYCLE_LENGTH);
              cycleDisplay = cycle - lastCycle;
      }


      this.checkpoints = checkpoints;
      this.year = year;
      this.cycleDisplay = cycleDisplay;
      // if (cycleDisplay < 10) {
      //    cycleDisplay = ''+'0'+cycleDisplay;
      // }     
      //    return {cycle: year+'.'+(cycleDisplay), checkpoints:checkpoints, current:(cycle == currentCycle)};
   }

   async getData(url: string): Promise<boolean> {
      const response = await fetch(url);

      if (response.status !== 200) {
         console.log('Looks like there was a problem. URL: ' + url + ' Status Code: ' + response.status);
         return false;
      }
      else {
         const myJson = await response.json();
         const parsed = JSON.parse(myJson);
         this.response.push(parsed);
         // console.log(parsed);

         // chart1
         const chartOptionsClone = Object.assign({}, chartOptions)

         chartOptionsClone.series = parsed.result.gameScore
         .map((element: string): number => {
            return parseInt(element);
         })
         .reverse();

         this.chartOptions.push(chartOptionsClone);

         // chart2
         const chartOptionsMixedClone = JSON.parse(JSON.stringify(chartOptionsMixedModel)); // deep clone
         
         parsed.result.scoreHistory
         .reverse()
         .forEach((element: string[]) => {
            chartOptionsMixedClone.series[0].data.push(parseInt(element[2]));
            chartOptionsMixedClone.series[1].data.push(parseInt(element[1]));
            chartOptionsMixedClone.xaxis.categories.push(element[0]);
         });

         this.chartOptionsMixed.push(chartOptionsMixedClone);
      }
      return true;
   }
}
