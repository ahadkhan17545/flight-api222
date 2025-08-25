
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FareQuoteService {
  constructor(
    private readonly http: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  

  formatFareQuote(raw: any) {
    const journey = raw?.UpdateFareQuote?.FareQuoteDetails?.JourneyList ?? null;
    const price = journey?.Price ?? null;
    const redisToken=uuidv4();

    return {
      Status: raw?.Status ?? 0,
      Message: raw?.Message ?? "",
      UpdateFareQuote: {
        FareQuoteDetails: {
          JourneyList: {
            FlightDetails: {
              Details: (journey?.FlightDetails?.Details ?? []).map((flightArray: any[]) =>
                flightArray.map((flight: any) => ({
                  Origin: {
                    AirportCode: flight?.Origin?.AirportCode ?? null,
                    CityName: flight?.Origin?.CityName ?? null,
                    AirportName: flight?.Origin?.AirportName ?? null,
                    DateTime: flight?.Origin?.DateTime ?? null,
                    Terminal: flight?.Origin?.Terminal ?? null,
                    FDTV: flight?.Origin?.FDTV ?? null,
                  },
                  Destination: {
                    AirportCode: flight?.Destination?.AirportCode ?? null,
                    CityName: flight?.Destination?.CityName ?? null,
                    AirportName: flight?.Destination?.AirportName ?? null,
                    DateTime: flight?.Destination?.DateTime ?? null,
                    Terminal: flight?.Destination?.Terminal ?? null,
                    FDTV: flight?.Destination?.FDTV ?? null,
                  },
                  OperatorCode: flight?.OperatorCode ?? null,
                  DisplayOperatorCode: flight?.DisplayOperatorCode ?? null,
                  ValidatingAirline: flight?.ValidatingAirline ?? null,
                  OperatorName: flight?.OperatorName ?? null,
                  FlightNumber: flight?.FlightNumber ?? null,
                  CabinClass: flight?.CabinClass ?? null,
                  Operatedbyairline: flight?.Operatedbyairline ?? null,
                  Operatedbyairlinename: flight?.Operatedbyairlinename ?? null,
                  Duration: flight?.Duration?Number(flight?.Duration): null,
                  Attr: {
                    Baggage: flight?.Attr?.Baggage ?? null,
                    CabinBaggage: flight?.Attr?.CabinBaggage ?? null,
                  },
                  stop_over: flight?.stop_over ?? null,
                })),
              ),
            },
            Price: {
              Currency: price?.Currency ?? null,
              TotalDisplayFare: price?.TotalDisplayFare?Number(price?.TotalDisplayFare):null,
              PriceBreakup: {
                BasicFare: price?.PriceBreakup?.BasicFare?Number(price?.PriceBreakup?.BasicFare):null,
                Tax: price?.PriceBreakup?.Tax?Number(price?.PriceBreakup?.Tax):null,
                AgentCommission: price?.PriceBreakup?.AgentCommission?Number(price?.PriceBreakup?.AgentCommission):null,
                AgentTdsOnCommision: price?.PriceBreakup?.AgentTdsOnCommision?Number(price?.PriceBreakup?.AgentTdsOnCommision):null,
              },
              PassengerBreakup: price?.PassengerBreakup ?? {},
            },
            ResultToken: journey?.ResultToken ?? null,
            Attr: {
              IsRefundable: journey?.Attr?.IsRefundable ?? false,
              AirlineRemark: journey?.Attr?.AirlineRemark ?? null,
              FareType: journey?.Attr?.FareType ?? null,
              IsLCC: journey?.Attr?.IsLCC ?? false,
              ExtraBaggage: journey?.Attr?.ExtraBaggage ?? false,
              conditions: journey?.Attr?.conditions ?? false,
            },
            HoldTicket: journey?.HoldTicket ?? false,
            redisToken: redisToken,
          },
        },
      },
    };
  }

  
  

  async FetchFareQuoteFromApi(resultToken: string) {
    const cacheKey=JSON.stringify(resultToken);

    const cacheResponse=await this.cacheManager.get(cacheKey);

  if(cacheResponse)
  {
    console.log('cache hit ');
    return cacheResponse
  }
  console.log('cache miss , api calling')
    

    try {
      const apiRes = await firstValueFrom(
        this.http.post(
          'http://test.services.travelomatix.com/webservices/index.php/flight/service/UpdateFareQuote',
          resultToken,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-Username': 'test245274',
              'x-Password': 'test@245',
              'x-DomainKey': 'TMX3372451534825527',
              'x-System': 'test',
            },
          },
        ),
      );

      const formatted = this.formatFareQuote(apiRes.data);
      const key = formatted.UpdateFareQuote.FareQuoteDetails.JourneyList.redisToken;
  

      console.log("Attempting to set cache key:", key);
      await this.cacheManager.set(key, formatted, { ttl: 3600 } as any);
      console.log("Cache key set successfully:", key);

      return formatted;
    } 
    catch (e) {
      console.error('API call or cache SET failed:', e);
      throw e;
    }
  }

  async GetByToken(token: string) {
    const cleanToken = token.trim();
    console.log('Looking up token:', cleanToken);

    try {
      const result = await this.cacheManager.get(cleanToken);
      console.log('Cache result:', result);

      if (!result) {
        throw new NotFoundException('Results not found for this token');
      }

      return result;
    } catch (e) {
      console.error('Cache GET failed:', e);
      throw new NotFoundException('Error retrieving token');
    }
  }
}