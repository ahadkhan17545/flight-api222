import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { FlightProviders } from './utils/flight-provider'
import { formatAsJourneyList, formatFareQuote, formatBooking } from './utils/flight-formatter';
import { logFile } from './utils/logger';
import { BookingDto } from './Dtos/Booking.dto';
import { FlightSearchDto } from './Dtos/flight-Search.dto';

@Injectable()
export class TMXProvider {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async CallApi(endpoint: string, payload: any): Promise<any> {
    const headers = {
      'Content-Type': this.configService.get<string>('Content-Type'),
      'x-Username': this.configService.get<string>('x-Username'),
      'x-Password': this.configService.get<string>('x-Password'),
      'x-DomainKey': this.configService.get<string>('x-DomainKey'),
      'x-System': this.configService.get<string>('x-System'),
    };

    try {
      const url = `${this.configService.get<string>('baseUrl')}${endpoint}`;
      const response = await firstValueFrom(
        this.http.post(url, payload, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error.message);
      throw new NotFoundException('Error while communicating with TMX API.');
    }
  }

  async FetchFlights(searchParams: FlightSearchDto): Promise<any> {
    const apiResponse = await this.CallApi('Search', searchParams);
    logFile('flightSearch', searchParams, apiResponse);

    const formatted = formatAsJourneyList(apiResponse);

    for (const journey of formatted.Search.FlightDataList.JourneyList.flat()) {
      const token = journey.ResultToken;
      const cacheObject = (journey as any).cacheObject;
      await this.cacheManager.set(token, cacheObject, { ttl: 3600 } as any);
      delete (journey as any).cacheObject;
    }

    return formatted;
  }

  

  async FetchFareQuote(payload: { ResultToken: string }) {
    const journey: any = await this.getByToken(payload.ResultToken);
    const accessToken = journey.OriginalResultToken;

    const apiRes = await this.CallApi('UpdateFareQuote', { ResultToken: accessToken });
    await this.cacheManager.del(payload.ResultToken);

    const { response, cacheObj } = await formatFareQuote(apiRes);

    if (cacheObj) {
      await this.cacheManager.set(cacheObj.ResultToken, cacheObj, { ttl: 3600 } as any);
    }

    return response;
  }

  async CommitBooking(payload: BookingDto) {
    const journey: any = await this.getByToken(payload.ResultToken);
    const acessToken = journey.OriginalResultToken;
    const UpdatedPayload = { ...payload, ResultToken: acessToken };

    const apiResponse = await this.CallApi('CommitBooking', UpdatedPayload);
    logFile('CommitBooking', payload, apiResponse);
    return formatBooking(apiResponse, 'CommitBooking');
  }

  async HoldTicket(payload: BookingDto) {
    const journey: any = await this.getByToken(payload.ResultToken);
    const accessToken = journey.OriginalResultToken;
    const UpdatedPayload = { ...payload, ResultToken: accessToken };

    const apiResponse = await this.CallApi('HoldTicket', UpdatedPayload);
    logFile('HoldTicket', payload, apiResponse);
    return formatBooking(apiResponse, 'HoldTicket');
  }

  private async getByToken(token: string) {
    const cleanToken = token.trim();
    const result = await this.cacheManager.get(cleanToken);
    if (!result) {
      throw new NotFoundException('Result not found for this token');
    }
    return result;
  }
}
