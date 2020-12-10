   import { Component } from '@angular/core';
   import * as moment from 'moment';
   import {environment} from '../environments/environment';
   import * as Constants from './constants';
   
   import {CycleService} from './cycle.service';

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
      styleUrls: ['./app.component.scss'],
   })
   export class AppComponent {
      
      //  @ViewChild("chart") chart: ChartComponent;

   title = "cell-score";
   loading = true;
   error = false;
   fetchURLS_PROD = [
      "https://www.vreezy.de/ingress/cell-score/assets/zone.php",
      "https://www.vreezy.de/ingress/cell-score/assets/zone.php?zone=2",
      "https://www.vreezy.de/ingress/cell-score/assets/zone.php?zone=3"
   ];

   fetchURLS_DEV = [
      "http://localhost:3000/empty",
      "http://localhost:3000/filled"
   ];
   
   // Web Service Response
   response: IGetRegionScoreDetails[] = [];

   // Cycle Service
   checkpoints: any[] = []

   // chartData
   chartOptions = [];
   chartOptionsMixed = [];
   index = 0;
   indexZeroValue = "xxx";


   cycle = 0;
   currentCycle = 0;
   cycleDisplay = 0;
   year = 0;
   
   currentCheckPoint = 0;
   nextCheckPoint = 0;
   UTC = false;

   constructor(private cycleService: CycleService) {}

   
   async ngOnInit() {
      this.checkpoints = this.cycleService.getCheckpoints();

      var fetchURLS = this.fetchURLS_DEV;
      if(environment.production) {
         fetchURLS = this.fetchURLS_PROD;
      }
      const promises = fetchURLS.map((url: string) => {
         return this.getData(url);
      })
      const results = await Promise.all(promises);
            
      if(results.every((result:boolean) => { return result})) {
         this.loading = false;
      } else {
         this.error = true;
      }

      this.sortResponse();
      this.setChartData();

      // TODO use CYCLE SERVICE this.cycle = Cycle.getCycle();

      // TODO use CYCLE SERVICE this.calcCycle();


      this.setNextCheckPoint();
      this.setIndexZeroValue();

      this.refreshAfterCheckPoint();      
   }

   refreshAfterCheckPoint(): void {
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
      if(total < 1) {
         return "0";
      }
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

   setIndexZeroValue(): void {
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



   isNext(start, now) {
      return (start.getTime() > now && (now + Constants.CHECKPOINT_LENGTH) > start.getTime());
   }

   changeIndex(index: number) {
      this.index = index;
      localStorage.setItem('index', index.toString());
   }



   async getData(url: string): Promise<boolean> {
      const response = await fetch(url);

      if (response.status !== 200) {
         console.log('Looks like there was a problem. URL: ' + url + ' Status Code: ' + response.status);
      }
      else {
         var myJson = await response.json();
         if(this.IsJsonString(myJson)){
            myJson = JSON.parse(myJson);
         }
         
         this.response.push(myJson);
         return true;
      }
      return false;
   }

   IsJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

   setChartData(): void {
      // Donut Chart with Team Scores
      this.response.forEach((element :IGetRegionScoreDetails) => {
         const chartOptionsClone = Object.assign({}, chartOptions);

         chartOptionsClone.series = element.result.gameScore
         .map((element: string): number => {
            return parseInt(element);
         })
         .reverse();

         this.chartOptions.push(chartOptionsClone);
      });      

      // Mixed Chart with Checkpoint MUs
      this.response.forEach((element :IGetRegionScoreDetails) => {
         const chartOptionsMixedClone = JSON.parse(JSON.stringify(chartOptionsMixedModel)); // deep clone
         
         element.result.scoreHistory
         .reverse()
         .forEach((element: string[]) => {
            chartOptionsMixedClone.series[0].data.push(parseInt(element[2]));
            chartOptionsMixedClone.series[1].data.push(parseInt(element[1]));
            chartOptionsMixedClone.xaxis.categories.push(element[0]);
         });

         this.chartOptionsMixed.push(chartOptionsMixedClone);
      });

   }
}
