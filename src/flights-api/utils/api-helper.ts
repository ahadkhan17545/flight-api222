import { HttpService } from "@nestjs/axios";
import { NotFoundException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
 


export const baseUrl = 'http://test.services.travelomatix.com/webservices/index.php/flight/service/';
export const headers = {
    'Content-Type': 'application/json',
    'x-Username': 'test245274',
    'x-Password': 'test@245',
    'x-DomainKey': 'TMX3372451534825527',
    'x-System': 'test',
  };


  export  async function  CallApi(http:HttpService,endpoint: string, payload: any):Promise<any>
 {
 
    try {
      const url = `${baseUrl}${endpoint}`;
      const response = await firstValueFrom(
        http.post(url, payload, { headers: headers }),
      );
      
      return response.data;
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error.message);
      throw new NotFoundException('An error occurred while communicating with the flight API.');
    }
  }

 