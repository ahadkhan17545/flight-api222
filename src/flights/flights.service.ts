import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';



@Injectable()
export class FlightsService {
  constructor(private readonly http: HttpService) { }

  async searchFlights(payload: any): Promise<any[]> {
    let req = {
      AdultCount: Number(payload.AdultCount),
      ChildCount: Number(payload.ChildCount),
      InfantCount: Number(payload.InfantCount),
      JourneyType: payload.JourneyType,
      PreferredAirlines: payload.PreferredAirlines?.length ? payload.PreferredAirlines : [],

      CabinClass: payload.CabinClass,
      Segments: [
        {
          Origin: payload.Segments?.[0]?.Origin,
          Destination: payload.Segments?.[0]?.Destination,
          DepartureDate: payload.Segments?.[0]?.DepartureDate,
        },
      ],
    };

    const response = await firstValueFrom(
      this.http.post(
        'http://test.services.travelomatix.com/webservices/index.php/flight/service/Search',
        req,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-Username': 'test245274',
            'x-DomainKey': 'TMX3372451534825527',
            'x-Password': 'test@245',
            'x-system': 'test'

          },
        }
      )
    );

    return response.data
  }



  async fetchFareRules(payload: { ResultToken: string }): Promise<any[]> {
    const req = {
      ResultToken: payload.ResultToken
    };

    const response = await firstValueFrom(
      this.http.post(
        'http://test.services.travelomatix.com/webservices/index.php/flight/service/FareRule',
        req,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-Username': 'test245274',
            'x-DomainKey': 'TMX3372451534825527',
            'x-Password': 'test@245',
            'x-system': 'test'
          },
        }
      )
    );

    return response.data;
  }


  async FetchFareQuote(payload: any): Promise<any[]> {

    const req = {
      ResultToken: payload.ResultToken
    };

    const response = await firstValueFrom(

      this.http.post('http://test.services.travelomatix.com/webservices/index.php/flight/service/UpdateFareQuote',
        req, {

        headers: {
          'Content-Type': 'application/json',
          'x-Username': 'test245274',
          'x-DomainKey': 'TMX3372451534825527',
          'x-Password': 'test@245',
          'x-system': 'test'
        }
      }


      )


    )

    return response.data

  }


  async UpdatedFareQuoteRound(payload: { ResultToken: string }) {

    const req = {
      ResultToken: payload.ResultToken

    }

    const response = await firstValueFrom(

      this.http.post(

        'http://test.services.travelomatix.com/webservices/index.php/flight/service/UpdateFareQuote',
        req,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-Username': 'test245274',
            'x-DomainKey': 'TMX3372451534825527',
            'x-Password': 'test@245',
            'x-system': 'test'
          }
        }
      )

    )

    return response.data

  }


  async ExtraService(payload: { ResultToken: string }) {

    const req = {

      ResultToken: payload.ResultToken
    }


    const response = await firstValueFrom(

      this.http.post(

        'http://test.services.travelomatix.com/webservices/index.php/flight/service/ExtraServices',
        req,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-Username': 'test245274',
            'x-DomainKey': 'TMX3372451534825527',
            'x-Password': 'test@245',
            'x-system': 'test'

          }
        }
      )

    )

    return response.data
  }

//http://54.198.46.240:6017/webservice/flight/commitBooking

  async CommitBooking(payload:any){

    const req = {
      AppReference: payload.AppReference,
      SequenceNumber: payload.SequenceNumber,
      ResultToken: payload.ResultToken,
      Passengers: [
        {
          IsLeadPax: payload.Passengers?.[0]?.IsLeadPax || "1",
          Title: payload.Passengers?.[0]?.Title || "Mr",
          FirstName: payload.Passengers?.[0]?.FirstName || "",
          LastName: payload.Passengers?.[0]?.LastName || "",
          Gender: payload.Passengers?.[0]?.Gender || 1,
          DateOfBirth: payload.Passengers?.[0]?.DateOfBirth || "",
          PassportNumber: payload.Passengers?.[0]?.PassportNumber || "",
          CountryCode: payload.Passengers?.[0]?.CountryCode || "IN",
          CountryName: payload.Passengers?.[0]?.CountryName || "",
          ContactNo: payload.Passengers?.[0]?.ContactNo || "",
          City: payload.Passengers?.[0]?.City || "",
          PinCode: payload.Passengers?.[0]?.PinCode || "",
          AddressLine1: payload.Passengers?.[0]?.AddressLine1 || "",
          Email: payload.Passengers?.[0]?.Email || "",
          PaxType: payload.Passengers?.[0]?.PaxType || 1,
        }
      ]
    };
    

   const response=await firstValueFrom(
    
    this.http.post('http://test.services.travelomatix.com/webservices/index.php/flight/service/CommitBooking',
    req,
    {
      headers:{

        'Content-Type': 'application/json',
            'x-Username': 'test245274',
            'x-DomainKey': 'TMX3372451534825527',
            'x-Password': 'test@245',
            'x-system': 'test'
      }
    }
    )



   )

   return response.data

  }







}