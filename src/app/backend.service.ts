import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

   constructor() { }

   async getData(url: string): Promise<any> {
      const response = await fetch(url);

      if (response.status !== 200) {
         console.log('Looks like there was a problem. URL: ' + url + ' Status Code: ' + response.status);
      }
      else {
         var myJson = await response.json();
         if(this.IsJsonString(myJson)){
            myJson = JSON.parse(myJson);
         }
         // TODO check for each property!         
         return myJson;
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
}
