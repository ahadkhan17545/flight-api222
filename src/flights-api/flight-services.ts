import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { formatAsJourneyList, formatFareQuote, decodeAccessToken, formatBooking } from './utils/flight-formatter';
import { logFile } from './utils/logger';
import { CallApi } from './utils/api-helper';
import { HttpService } from '@nestjs/axios';
import { FlightSearchDto } from './Dtos/flight-Search.dto';
import { BookingDto } from './Dtos/Booking.dto';
import { v4 as uuid4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FlightsApiService {

  constructor(
    private readonly http: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }




  public async searchFlights(payload: FlightSearchDto) {
    const apiResponse = await CallApi(this.http, 'Search', payload);

    logFile('flightSearch', payload, apiResponse);
    const formatted = formatAsJourneyList(apiResponse);
    for (const journey of formatted.Search.FlightDataList.JourneyList.flat()) {

      const token = journey.ResultToken;
      await this.cacheManager.set(token, journey, { ttl: 3600 } as any);
    }
    return formatted;
  }


  public async FetchFareQuote(payload: { ResultToken: string }) {
    const tokenString = payload.ResultToken;
    const accessToken = decodeAccessToken(tokenString);
    const apiRes = await CallApi(this.http, 'UpdateFareQuote', { ResultToken: accessToken });

    logFile('FareQuote', payload, apiRes);

     return formatFareQuote(apiRes);
  }



  public async CommitBooking(payload: BookingDto) {
    const tokenString = payload.ResultToken;
    console.log(tokenString)
    const apiResponse = await CallApi(this.http, 'CommitBooking', payload);
    logFile('CommitBooking', payload, apiResponse);
    return formatBooking(apiResponse,'CommitBooking');
  }

  public async HoldTicket(payload:BookingDto){
    const apiResponse=await CallApi(this.http,'HoldTicket',payload);
    logFile('HoldTicket',payload,apiResponse);
    
    return formatBooking(apiResponse,'HoldTicket');
  }



  public GenerateAppRefernce() {
    return 'FB' + uuid4().replace(/-/g, '').substring(0, 18);
  }


  async getByToken(token: string) {
    const cleanToken = token.trim();
    console.log(' Looking up flight token in cache:', cleanToken);

    const result = await this.cacheManager.get(cleanToken);
    if (!result) {
      console.log(' Token not found in cache:', cleanToken);
      throw new NotFoundException('Result not found for this token');
    }

    console.log(' Token found in cache:', cleanToken);
    return result;
  }


}