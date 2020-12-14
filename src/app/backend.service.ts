import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

   constructor() { }

   async getAllData(urls: string[]): Promise<any[]> {
      const promises = urls.map((url: string) => {
         return this.getData(url);
      });

      var response = await Promise.all(promises);
      this.removeNull(response);
      this.sortData(response);

      return response;
   }

   async getData(url: string): Promise<any> {
      const response = await fetch(url);

      if (response.status !== 200) {
         console.log('Looks like there was a problem. URL: ' + url + ' Status Code: ' + response.status);
      }
      else {
         var obj = await response.json();
         if(this.IsJsonString(obj)){
            obj = JSON.parse(obj);
         }
         return obj;
      }
      return null;
   }

   // Helper
   private IsJsonString(str: string) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
   }

   private removeNull(ary: any[]): void {
      ary.filter((obj: any) => {
         if(obj) {
            return true;
         }
         return false;
      });
   }

   private sortData(ary: any[]): void {
      ary.sort((a, b) => {
         if(a.result.regionName < b.result.regionName) { return -1; }
         if(a.result.regionName > b.result.regionName) { return 1; }
         return 0;
      });
   }
}
