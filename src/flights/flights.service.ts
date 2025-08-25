import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class FlightsService {
  constructor(
    private readonly http: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

 
  
  private formatAsJourneyList(raw: any) {
    const journeys: any[] = raw?.Search?.FlightDataList?.JourneyList || [];
    const redisToken=uuidv4();

    const formattedJourneys = journeys.map((journey) =>
      journey.map((flight) => {
        const priceBreakup = flight?.Price?.PriceBreakup ?? {};
        const passengerBreakup = flight?.Price?.PassengerBreakup ?? {};
        const attributes = flight?.Attr ?? {};
        
        return {
          FlightDetails: {
            Details: (flight?.FlightDetails?.Details ?? []).map(
              (FlightStops: any[]) =>
                FlightStops.map((segment: any) => ({
                  Origin: {
                    AirportCode: segment.Origin?.AirportCode ?? null,
                    CityName: segment.Origin?.CityName ?? null,
                    AirportName: segment.Origin?.AirportName ?? null,
                    DateTime: segment.Origin?.DateTime ?? null,
                    Terminal: segment.Origin?.Terminal ?? null,
                  },
                  Destination: {
                    AirportCode: segment.Destination?.AirportCode ?? null,
                    CityName: segment.Destination?.CityName ?? null,
                    AirportName: segment.Destination?.AirportName ?? null,
                    DateTime: segment.Destination?.DateTime ?? null,
                    Terminal: segment.Destination?.Terminal ?? null,
                  },
                  OperatorCode: segment.OperatorCode ?? null,
                  OperatorName: segment.OperatorName ?? null,
                  FlightNumber: segment.FlightNumber ?? null,
                  Duration: segment.Duration?Number(segment.Duration): null,
                  CabinClass: segment.CabinClass ?? null,
                  Attr: {
                    Baggage: segment.Attr?.Baggage ?? null,
                    CabinBaggage: segment.Attr?.CabinBaggage ?? null,
                    AvailableSeats: segment.Attr?.AvailableSeats?Number(segment.Attr?.AvailableSeats):null,
                  },
                  stop_over: segment.stop_over ?? null,
                }))
            ),
          },
          Price: {
            Currency: flight.Price?.Currency ?? null,
            TotalDisplayFare: flight.Price?.TotalDisplayFare?Number(flight.Price?.TotalDisplayFare):null,
            PriceBreakup: {
              BasicFare: priceBreakup.BasicFare?Number(priceBreakup.BasicFare): null,
              Tax: priceBreakup.Tax?Number(priceBreakup.Tax):null,
              AgentCommission: priceBreakup.AgentCommission?Number(priceBreakup.AgentCommission):null,
            },
            PassengerBreakup: {
              ADT: {
                BasePrice: passengerBreakup.ADT?.BasePrice?Number(passengerBreakup.ADT?.BasePrice):null,
                Tax: passengerBreakup.ADT?.Tax?Number(passengerBreakup.ADT?.Tax):null,
                TotalPrice: passengerBreakup.ADT?.TotalPrice?Number(passengerBreakup.ADT?.TotalPrice):null,
                PassengerCount: passengerBreakup.ADT?.PassengerCount?Number(passengerBreakup.ADT?.PassengerCount):null,
              },
            },
          },
          Attr: {
            IsRefundable: attributes.IsRefundable ?? false,
            AirlineRemark: attributes.AirlineRemark ?? null,
            FareType: attributes.FareType ?? null,
            IsLCC: attributes.IsLCC ?? false,
            ExtraBaggage: attributes.ExtraBaggage ?? false,
            conditions: {
              IsPassportRequiredAtBook:
                attributes.conditions?.IsPassportRequiredAtBook ?? false,
              IsPanRequiredAtBook:
                attributes.conditions?.IsPanRequiredAtBook ?? false,
            },
          },
          apiResultToken: flight?.ResultToken ?? null,
          redisToken:redisToken
          
        };
      }),
    );

    return {
      Status: raw?.Status ?? null,
      Message: raw?.Message ?? '',
      Search: {
        FlightDataList: {
          JourneyList: formattedJourneys,
        },
      },
    };
  }

 
  async searchFlights(Payload) {
    
    const apiResp = await firstValueFrom(
      this.http.post(
        'http://test.services.travelomatix.com/webservices/index.php/flight/service/Search',
        Payload,
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

    const formatted = this.formatAsJourneyList(apiResp?.data ?? {});



    const journeyList = formatted.Search.FlightDataList.JourneyList.flat();
    for (const flight of journeyList) {
      const token = flight.redisToken?.trim();
      if (token) {
        try {
          await this.cacheManager.set(token, flight, { ttl: 3600 } as any);
          console.log('Flight token saved:', token);
        } catch (e) {
          console.error('Cache SET failed for flight token:', e);
        }
      }
    }

    return formatted;
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
