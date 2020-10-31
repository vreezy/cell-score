   import { Component } from '@angular/core';
   import { ChartComponent } from "ng-apexcharts";


   import {
      ApexNonAxisChartSeries,
      ApexResponsive,
      ApexChart
   } from "ng-apexcharts";

   export type ChartOptions = {
      series: ApexNonAxisChartSeries;
      chart: ApexChart;
      responsive: ApexResponsive[];
      labels: any;
   };

   @Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
   })
   export class AppComponent {
      //  @ViewChild("chart") chart: ChartComponent;

   loading = true;
   data = {};
   data2 = {};
   zone = 1;

   chartOptions = {
      series: [50,50],
      chart: {
      type: "donut"
      },
      labels: ["RES", "ENL"],

   };

   chartOptions2 = {
      series: [50,50],
      chart: {
      type: "donut"
      },
      labels: ["RES", "ENL"],

   };

   async ngOnInit() {
      await this.getData1();
      await this.getData2();
      this.loading = false;
      // this.getData1()
      // .then(() => {
      //    this.getData2()
      // })
      // .then(() => {
         
      // });
   }

   switchZone(): void {
      if (this.zone === 1) {
         this.zone = 2;
      }
      else {
         this.zone = 1;
      }
   }

   async getData1(): Promise<boolean> {
      const url = "https://www.vreezy.de/ingress/cell-score/zone1.php";

      const response = await fetch(url);

      if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      }
      else {
      const myJson = await response.json();
      const parsed = JSON.parse(myJson);
      console.log();
      this.data = parsed;
      console.log(parsed.result.gameScore);
      this.chartOptions.series = parsed.result.gameScore.map((element: string): number => {
         return parseInt(element);
      })
      .reverse();

      }

      return true;
   }

   async getData2(): Promise<boolean> {
      const url = "https://www.vreezy.de/ingress/cell-score/zone2.php";
   
      const response = await fetch(url);
   
      if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      }
      else {
      const myJson = await response.json();
      const parsed = JSON.parse(myJson);
      console.log(parsed);
      this.data2 = parsed;
      console.log(parsed.result.gameScore);
      this.chartOptions2.series = parsed.result.gameScore.map((element: string): number => {
         return parseInt(element);
      })
      .reverse();

      }

      return true;
   }
   
}
