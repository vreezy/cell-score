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
      curve: 'smooth'
   },
   xaxis: {
      // type: 'datetime',
      categories: []
   },
   theme: {
      mode: 'dark', 
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
      "https://www.vreezy.de/ingress/cell-score/assets/zone.php?zone=2"
   ]

   response = [];
   chartOptions = [];
   chartOptionsMixed = [];
   index = 0;
   
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
   }

   switchZone(index: number): void {
      if(index + 1 === this.response.length) {
         this.index = 0;
      }
      else {
         this.index = index + 1;
      }
   }

   getNextZoneName(index: number): void {
      if(index + 1 === this.response.length) {
         return this.response[0].result.regionName
      }
      else {
         return this.response[index + 1].result.regionName
      }
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

         // chart1
         const chartOptionsClone = Object.assign({}, chartOptions)

         chartOptionsClone.series = parsed.result.gameScore
         .map((element: string): number => {
            return parseInt(element);
         })
         .reverse();

         this.chartOptions.push(chartOptionsClone)

         // chart2
         const chartOptionsMixedClone = Object.assign({}, chartOptionsMixedModel)

         parsed.result.scoreHistory
         .reverse()
         .forEach((element: string[]) => {
            console.log(element[1])
            chartOptionsMixedClone.series[0].data.push(parseInt(element[1]));
            console.log(chartOptionsMixedClone.series[0].data)
            chartOptionsMixedClone.series[1].data.push(parseInt(element[2]));
            chartOptionsMixedClone.xaxis.categories.push(element[0]);
         });

          console.log(url)
         // console.log(parsed.result.scoreHistory[0]);
         // console.log(chartOptionsMixedClone.series[0].data[0]);

         this.chartOptionsMixed.push(chartOptionsMixedClone);
      }
      return true;
   }
}
