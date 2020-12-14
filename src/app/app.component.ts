   import { Component } from '@angular/core';
   // import * as moment from 'moment';
   import { environment } from '../environments/environment';

   // Services
   import { CycleService } from './cycle.service';
   import { BackendService } from './backend.service';

   // Interfaces
   import { IGetRegionScoreDetails } from './IGetRegionScoreDetails'; // TODO
   import { ICheckpoint } from './ICheckpoint';

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
      
   constructor(private cycleService: CycleService, private backendService: BackendService) {}

   // Component Basis
   loading = true;
   error = false;

   // chartData
   chartOptions = [];
   chartOptionsMixed = [];
   index = 0;
   indexZeroValue = "xxx";
   
   // Cycle Service Data
   checkpoints: ICheckpoint[] = [];
   currentCheckpoint: ICheckpoint = null;
   cycle = 0;
   cycleDisplay = 0;
   year = 0;

   // Backend Service Data
   response: IGetRegionScoreDetails[] = [];

   async ngOnInit() {
      // Cycle Service INIT
      this.checkpoints = this.getCheckPoints();
      this.currentCheckpoint = this.getCurrentCheckpoint();
      this.cycle = this.getCycle();
      this.cycleDisplay = this.getCycleDisplay();
      this.year = new Date().getFullYear()

      // Backend Service Init
      this.response = await this.getAllData(environment.urls);

      // Chart Setup
      this.setChartData();
      this.setIndexZeroValue();

      // Auto Reaload PAge after Checkpoint
      this.reloadPageAfterCheckPoint();  
      
      this.loading = false;
   }

   // Cycle Service
   getCheckPoints(): ICheckpoint[] {
      return this.cycleService.getCheckpoints();
   }

   getCurrentCheckpoint(): ICheckpoint {
      return this.cycleService.getCurrentCheckpoint();
   }

   getCycle(): number {
      return this.cycleService.getCycle();
   }

   getCycleDisplay(): number {
      return this.cycleService.getCycleDisplay()
   }

   // Data Service
   // async getData(url: string): Promise<any> {
   //    return await this.backendService.getData(url);
   // }

   async getAllData(urls: string[]): Promise<any[]> {
      return await this.backendService.getAllData(urls);
   }

   
   // Chart Helper

   
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

   changeIndex(index: number) {
      this.index = index;
      localStorage.setItem('index', index.toString());
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
         
         var count = 0;
         element.result.scoreHistory
         .reverse()
         .forEach((element: string[]) => {
            chartOptionsMixedClone.series[0].data.push(parseInt(element[2]));
            chartOptionsMixedClone.series[1].data.push(parseInt(element[1]));
            chartOptionsMixedClone.xaxis.categories.push(element[0] + ". " + this.checkpoints[count].localeDate + " " + this.checkpoints[count].localeTime);
            count++;
         });

         this.chartOptionsMixed.push(chartOptionsMixedClone);

      });

   }


   // Other
   reloadPageAfterCheckPoint(): void {
      if(this.currentCheckpoint && this.currentCheckpoint.date && this.currentCheckpoint.date instanceof Date) {
         const refresinMS = this.currentCheckpoint.date.getTime() + 180000;
         window.setInterval('window.location.reload()', refresinMS);
      }
   }
}
